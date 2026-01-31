"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { DateTime } from "luxon";

export type AvailabilityStatus = "available" | "limited" | "unavailable";

export interface SelectedTimeRangeUtc {
  startUtc: number;
  endUtc: number;
}

export interface LocationContainerProps {
  timezoneId: string;
  locationLabel: string;
  /** ISO date for the timeline day (e.g. "2025-01-27") */
  selectedDateIso: string;
  /** Shared UTC window start (ms) - same for all containers so selection lines align */
  utcWindowStartMs: number;
  /** Shared UTC window end (ms) - start + 25 hours */
  utcWindowEndMs: number;
  /** Global selected time range in UTC ms - shown on all containers */
  selectedRangeUtc: SelectedTimeRangeUtc | null;
  /** Called when user finishes drag-selecting a range on this container */
  onSelectRange: (startUtc: number, endUtc: number) => void;
  onRemove?: () => void;
  /** 24-hour availability for the selected date (0-23). Defaults to mock pattern. */
  availability?: AvailabilityStatus[];
}

// Default mock availability: green morning, orange afternoon/evening, red night
function getDefaultAvailability(): AvailabilityStatus[] {
  return Array.from({ length: 24 }, (_, hour) => {
    if (hour >= 8 && hour <= 12) return "available";
    if (hour >= 13 && hour <= 23) return "limited";
    return "unavailable";
  });
}

const statusColors: Record<AvailabilityStatus, string> = {
  available: "bg-available",
  limited: "bg-limited",
  unavailable: "bg-unavailable",
};

const SLOT_COUNT = 25; // 24 hours + next day 12am

export function LocationContainer({
  timezoneId,
  locationLabel,
  selectedDateIso,
  utcWindowStartMs,
  utcWindowEndMs,
  selectedRangeUtc,
  onSelectRange,
  onRemove,
  availability = getDefaultAvailability(),
}: LocationContainerProps) {
  const [currentTime, setCurrentTime] = useState<DateTime>(
    DateTime.now().setZone(timezoneId)
  );
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<number | null>(null);
  const [dragEndSlot, setDragEndSlot] = useState<number | null>(null);
  const dragEndSlotRef = useRef<number | null>(null);
  dragEndSlotRef.current = dragEndSlot;
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now().setZone(timezoneId));
    }, 1000);
    return () => clearInterval(interval);
  }, [timezoneId]);

  const offset = currentTime.offset / 60;
  const offsetStr = offset >= 0 ? `GMT+${offset}` : `GMT${offset}`;
  const dateStr = currentTime.toFormat("d MMM");

  const utcWindowDurationMs = utcWindowEndMs - utcWindowStartMs;

  // Build 25 slots from shared UTC window - each slot = 1 UTC hour; show local time label
  const hours = Array.from({ length: SLOT_COUNT }, (_, i) => {
    const slotUtcMs = utcWindowStartMs + i * 60 * 60 * 1000;
    const local = DateTime.fromMillis(slotUtcMs).setZone(timezoneId);
    const hour = local.hour;
    const prevLocal =
      i > 0
        ? DateTime.fromMillis(
            utcWindowStartMs + (i - 1) * 60 * 60 * 1000
          ).setZone(timezoneId)
        : null;
    const isNewDay =
      prevLocal != null &&
      local.toFormat("yyyy-MM-dd") !== prevLocal.toFormat("yyyy-MM-dd");
    const nextDayLabel = isNewDay ? local.toFormat("EEE MMM d").toUpperCase() : null;
    const hourNum = hour === 0 ? "12" : hour === 12 ? "12" : hour < 12 ? `${hour}` : `${hour - 12}`;
    const ampm = hour < 12 ? "am" : "pm";
    return {
      index: i,
      hour,
      hourNum,
      ampm,
      status: availability[hour] ?? "unavailable",
      isDateTransition: isNewDay,
      nextDayLabel,
    };
  });

  // Selection: use UTC-based percentages so lines align across all containers
  const { rangeStartPercent, rangeEndPercent, hasSelection, startTimeLabel, endTimeLabel } = (() => {
    if (!selectedRangeUtc) {
      if (dragStartSlot == null || dragEndSlot == null)
        return { rangeStartPercent: 0, rangeEndPercent: 0, hasSelection: false, startTimeLabel: "", endTimeLabel: "" };
      const lo = Math.min(dragStartSlot, dragEndSlot);
      const hi = Math.max(dragStartSlot, dragEndSlot);
      // Get local time labels for start and end
      const startUtcMs = utcWindowStartMs + lo * 60 * 60 * 1000;
      const endUtcMs = utcWindowStartMs + (hi + 1) * 60 * 60 * 1000;
      const startLocal = DateTime.fromMillis(startUtcMs).setZone(timezoneId);
      const endLocal = DateTime.fromMillis(endUtcMs).setZone(timezoneId);
      return {
        rangeStartPercent: (lo / SLOT_COUNT) * 100,
        rangeEndPercent: ((hi + 1) / SLOT_COUNT) * 100,
        hasSelection: true,
        startTimeLabel: startLocal.toFormat("h:mm a"),
        endTimeLabel: endLocal.toFormat("h:mm a"),
      };
    }
    const startPercent =
      Math.max(
        0,
        ((selectedRangeUtc.startUtc - utcWindowStartMs) / utcWindowDurationMs) * 100
      );
    const endPercent =
      Math.min(
        100,
        ((selectedRangeUtc.endUtc - utcWindowStartMs) / utcWindowDurationMs) * 100
      );
    const startLocal = DateTime.fromMillis(selectedRangeUtc.startUtc).setZone(timezoneId);
    const endLocal = DateTime.fromMillis(selectedRangeUtc.endUtc).setZone(timezoneId);
    return {
      rangeStartPercent: startPercent,
      rangeEndPercent: endPercent,
      hasSelection: endPercent > startPercent,
      startTimeLabel: startLocal.toFormat("h:mm a"),
      endTimeLabel: endLocal.toFormat("h:mm a"),
    };
  })();

  const getSlotIndexFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent): number | null => {
      const el = timelineRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      let x: number;
      if ("touches" in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
      } else if ("changedTouches" in e && e.changedTouches.length > 0) {
        x = e.changedTouches[0].clientX;
      } else if ("clientX" in e) {
        x = e.clientX;
      } else {
        return null;
      }
      const relativeX = x - rect.left;
      const width = rect.width;
      if (relativeX < 0 || relativeX > width) return null;
      const slotWidth = width / SLOT_COUNT;
      const index = Math.min(
        Math.floor(relativeX / slotWidth),
        SLOT_COUNT - 1
      );
      return index;
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const index = getSlotIndexFromEvent(e);
      if (index == null) return;
      hasMovedRef.current = false; // Reset movement tracking
      setIsDragging(true);
      setDragStartSlot(index);
      setDragEndSlot(index);
    },
    [getSlotIndexFromEvent]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      
      // Store initial touch position and time
      touchStartPos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      hasMovedRef.current = false;
      
      const index = getSlotIndexFromEvent(e);
      if (index == null) return;
      
      // Start drag immediately - we'll cancel if it's a scroll
      setDragStartSlot(index);
      setDragEndSlot(index);
      setIsDragging(true);
    },
    [getSlotIndexFromEvent]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      hasMovedRef.current = true; // Track that mouse has moved
      const index = getSlotIndexFromEvent(e);
      if (index != null) setDragEndSlot(index);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      
      if (!isDragging || !touchStartPos.current) return;
      
      const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
      const deltaTime = Date.now() - touchStartPos.current.time;
      
      // If user hasn't moved much yet, check if it's a fast swipe (scroll) or slow drag (select)
      if (!hasMovedRef.current && deltaTime < 150) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const speed = distance / deltaTime; // pixels per millisecond
        
        // Fast swipe = scroll (speed > 1 px/ms), allow default scrolling
        if (speed > 1 && deltaX > 20) {
          setIsDragging(false);
          setDragStartSlot(null);
          setDragEndSlot(null);
          touchStartPos.current = null;
          hasMovedRef.current = false;
          return;
        }
      }
      
      // If we get here, it's a selection drag - prevent scrolling and update selection
      hasMovedRef.current = true;
      e.preventDefault();
      const index = getSlotIndexFromEvent(e);
      if (index != null) setDragEndSlot(index);
    };
    
    const handleEnd = () => {
      const startSlot = dragStartSlot;
      const endSlot = dragEndSlotRef.current;
      const wasDragging = isDragging;
      const hasMoved = hasMovedRef.current;
      
      setIsDragging(false);
      setDragStartSlot(null);
      setDragEndSlot(null);
      touchStartPos.current = null;
      hasMovedRef.current = false;
      
      // Only create selection if we were actively dragging
      // For touch: require movement to distinguish from tap
      // For mouse: allow even without movement (click = single slot selection)
      if (!wasDragging || startSlot == null || endSlot == null) return;
      
      // For touch events, require movement to avoid accidental selections
      if (touchStartPos.current !== null && !hasMoved) return;
      
      const lo = Math.min(startSlot, endSlot);
      const hi = Math.max(startSlot, endSlot);
      // Map UTC window slots to UTC ms so selection aligns across all containers
      const startUtc = utcWindowStartMs + lo * 60 * 60 * 1000;
      const endUtc = utcWindowStartMs + (hi + 1) * 60 * 60 * 1000;
      onSelectRange(startUtc, endUtc);
    };
    
    if (isDragging || dragStartSlot != null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);
    }
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
    };
  }, [
    isDragging,
    dragStartSlot,
    utcWindowStartMs,
    onSelectRange,
    getSlotIndexFromEvent,
  ]);

  return (
    <div className="location-container rounded-xl bg-primary/80 backdrop-blur-sm border border-white/5 px-6 pt-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-4xl font-bold text-white mb-1">
            {currentTime.toFormat("h:mm a")}
          </div>
          <div className="text-xl font-medium text-white">
            {locationLabel}
          </div>
          <div className="text-sm text-white/70">{offsetStr}</div>
          <div className="text-sm text-white/60 mt-1">{dateStr}</div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-white/50 hover:text-logo-pink transition-colors p-1"
            aria-label="Remove location"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Time grid with click-and-drag selection */}
      <div className="timeline-scroll overflow-x-auto relative">
        <div
          ref={timelineRef}
          role="slider"
          aria-label="Select time range"
          tabIndex={0}
          className="flex gap-1 min-w-max relative select-none cursor-crosshair py-4"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Selection overlay and vertical lines - same % on all containers so they align */}
          {(hasSelection || isDragging) && (
            <>
              {/* Selection box - gradient background between vertical lines */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none transition-all duration-150 ease-out"
                style={{
                  left: `${rangeStartPercent}%`,
                  width: `${rangeEndPercent - rangeStartPercent}%`,
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.15) 100%)",
                }}
              />
              {/* Vertical line at start with time label */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none transition-all duration-150"
                style={{ left: `${rangeStartPercent}%` }}
              >
                <div className="relative h-full">
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white" />
                  {isDragging && (
                    <div className="absolute -top-8 left-1 bg-logo-pink text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-fadeIn">
                      {startTimeLabel}
                    </div>
                  )}
                </div>
              </div>
              {/* Vertical line at end with time label */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none transition-all duration-150"
                style={{ left: `${rangeEndPercent}%` }}
              >
                <div className="relative h-full">
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white" />
                  {isDragging && (
                    <div className="absolute -top-8 -right-1 bg-logo-pink text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-fadeIn">
                      {endTimeLabel}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {hours.map(({ index, hour, hourNum, ampm, status, isDateTransition, nextDayLabel }) => (
            <div
              key={index}
              className={`flex flex-col items-center min-w-[3rem] py-1 px-1 relative z-10 ${
                isDateTransition ? "bg-white/10 rounded-lg" : ""
              }`}
            >
              {nextDayLabel ? (
                <span className="text-xs text-white/60 font-medium mb-1">
                  {nextDayLabel}
                </span>
              ) : (
                <div className="flex flex-col items-center mb-0.5">
                  <span className="text-base text-white leading-tight">{hourNum}</span>
                  <span className="text-xs text-white/70 leading-tight">{ampm}</span>
                </div>
              )}
              <div
                className={`w-2 h-2 rounded-full ${statusColors[status]}`}
                title={`${hourNum} ${ampm}: ${status}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

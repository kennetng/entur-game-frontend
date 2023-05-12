import { format, formatDuration, parseISO } from 'date-fns'
import { intervalToDuration } from 'date-fns/esm'
import { nb } from 'date-fns/locale'

export function formatInterval(currentTime: Date, startTime: Date): string {
    return (
        formatDuration(
            intervalToDuration({ end: currentTime, start: startTime }),
            { locale: nb, delimiter: ', ' },
        ) || '0 minutter'
    )
}

export function formatTimeForEndOfGame(currentTime: Date, startTime: Date): string{
    const timePlayed = intervalToDuration({ end: currentTime, start: startTime })
    const hours = (timePlayed.hours ?? 0 * 3600).toString()
    const minutes = (timePlayed.minutes ?? 0 * 60).toString()
    const seconds = (timePlayed.seconds ?? 0).toString()
    return  hours + ' timer ' + minutes + ' minutter ' + seconds + ' sekunder'
}

export function formatIntervalToSeconds(
    currentTime: Date,
    startTime: Date,
): number {
    const duration = intervalToDuration({ end: currentTime, start: startTime })
    return (
        (duration.seconds ?? 0) +
        (duration.minutes ?? 0) * 60 +
        (duration.hours ?? 0) * 3600
    )
}

export function formatTime(value: Date | string): string {
    const date = typeof value === 'string' ? parseISO(value) : value
    return format(date, 'HH:mm', { locale: nb })
}

export function formatDateAndTime(value: Date | string): string {
    const date = typeof value === 'string' ? parseISO(value) : value
    return format(date, "cccc eo MMMM 'kl.' HH:mm", { locale: nb })
}

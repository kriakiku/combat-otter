export interface InputService {
    start: () => Promise<void> | void
    stop: () => Promise<void> | void
    getInput: () => Promise<Buffer | null>
}
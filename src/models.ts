export type BlockerStatus = 'none' | 'blocked' | 'resolved'

export interface DailyUpdate {
  id: string
  personName: string
  yesterday: string
  today: string
  blocker: string
  blockerStatus: BlockerStatus
  updateDate: string
}

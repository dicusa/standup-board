export type Person = { name: string }

export type DailyUpdate = {
  id: string
  personName: Person['name']
  yesterday: string
  today: string
  blocker: string
  blockerResolved: boolean
  updateDate: string
}

export type BoardData = { personName: Person['name']; updates: DailyUpdate[] }

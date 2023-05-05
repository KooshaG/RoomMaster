
// The RoomAvailability type represents one "block" of room that is available. Each block is 30 minutes long
export type RoomAvailability = {
  start: string,
  end: string,
  seat_id: string,
  lid: number,
  eid: number
  checksum: string
}
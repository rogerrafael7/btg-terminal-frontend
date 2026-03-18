export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

export type Slot = {
  id: string;
  code: string;
  name: string;
  type: "VIP_LOUNGE" | "HANGAR" | "GROUND_SERVICE";
  description: string | null;
};

export type Reservation = {
  id: string;
  status: ReservationStatus;
  statusLabel: string;
  startsAt: string;
  endsAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  checkedInAt: string | null;
  cancelledAt: string | null;
  passenger: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string | null;
  };
  slot: Slot;
};

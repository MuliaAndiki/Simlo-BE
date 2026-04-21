import { reportType } from "@prisma/client";

interface IReport {
  id: string;
  userID: string;
  image_url: string;
  latitude: number;
  longitude: number;
  city: string;
  address_detail: string;
  reportStatus: reportType;
}

export type PickCreateReport = Pick<
  IReport,
  | "image_url"
  | "latitude"
  | "longitude"
  | "city"
  | "address_detail"
  | "reportStatus"
>;
export type PickDeleteReport = Pick<IReport, "id">;

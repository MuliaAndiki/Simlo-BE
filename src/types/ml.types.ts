export interface IBoundingBox {
  x: number;
  y: number;
  height: number;
  width: number;
  label: string;
}

export interface ManualLabelPayload {
  boundingBoxes: IBoundingBox[];
  confidenceScore?: number;
}

export interface IMLResponse {
  is_Detected: boolean;
  confidenceScore: number;
  model_version: string;
  processed_at: Date;
  boundingBoxes: IBoundingBox[];
}

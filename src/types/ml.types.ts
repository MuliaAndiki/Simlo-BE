interface IBoundingBox {
  x: number;
  y: number;
  height: number;
  width: number;
  label: string;
}

export interface IMLResponse {
  is_Detected: boolean;
  confidenceScore: number;
  model_version: string;
  processed_at: Date;
  boundingBoxes: IBoundingBox[];
}

export interface AgriculturalType {
  agricultural_type_id: number;
  agricultural_type_name: string;
  agricultural_type_status: boolean;
}

export interface GetAgriculturalPayload {
  limit: number;
  offset: number;
  search?: string;
  agricultural_type_status?: boolean | null;
}

export interface GetAgriculturalResult {
  total_item: number;
  data: AgriculturalType[];
}

export interface CreateAgriculturalPayload {
  agricultural_type_name: string;
  agricultural_type_status: boolean;
}

export interface UpdateAgriculturalPayload {
  agricultural_type_id: number;
  agricultural_type_name: string;
  agricultural_type_status: boolean;
}

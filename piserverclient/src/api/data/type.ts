export interface DataListResponse {
    Count: number;
    Data: DataItem[];
}

export interface DataItem {
    Id: number;
    Name: string;
    Path: string;
    Value: number;
    MaxLimit: number | null;
    MinLimit: number | null;
    AlarmMessage: string | null;
}

export interface TagDefinition {
    Id: number;
    Name: string;
    Path: string;
}

export interface TagDefinitionsResponse {
    success: boolean;
    data: TagDefinition[];
    count: number;
}

export interface TrendRequest {
    TagPaths: string[];
    StartTime: string;
    EndTime: string;
    Interval?: string;
}

export interface TrendDataPoint {
    Time: string;
    Value: number;
}

export interface TagDataGroup {
    TagPath: string;
    TagName: string;
    DataPoints: TrendDataPoint[];
}

export interface TrendResponse {
    success: boolean;
    data: TagDataGroup[]; 
    message?: string;
}
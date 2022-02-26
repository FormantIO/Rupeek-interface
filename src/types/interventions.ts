export interface intervention {
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  time: string;
  endTime: null | string;
  message: string;
  viewed: boolean;
  deviceId: string | null;
  streamName: string | null;
  streamType: string | null;
  tags: {};
  notificationEnabled: boolean;
  interventionType: string;
  data: {
    instruction: string;
  };
  responses: [];
}

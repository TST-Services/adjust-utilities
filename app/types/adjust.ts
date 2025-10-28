export interface AdjustDeviceResponse {
  Adid: string;
  AdvertisingId: string;
  Tracker: string;
  TrackerName: string;
  FirstTracker: string;
  FirstTrackerName: string;
  Environment: string;
  ClickTime: string;
  InstallTime: string;
  LastSessionTime: string;
  LastEventsInfo: {
    [key: string]: {
      name: string;
      time: string;
    };
  };
  LastSdkVersion: string;
  State: string;
}

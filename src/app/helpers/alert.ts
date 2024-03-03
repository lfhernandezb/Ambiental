export class Alert {
  id: string;
  type: AlertType;
  message: string;
  autoClose: boolean;
  keepAfterRouteChange?: boolean;
  fade: boolean;

  constructor(init?:Partial<Alert>) {
     this.id = '';
     this.type = 0;
     this.message = '';
     this.autoClose = false;
     this.keepAfterRouteChange = false;
     this.fade = false;

     Object.assign(this, init);
  }
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}

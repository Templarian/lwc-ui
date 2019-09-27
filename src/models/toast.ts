export default class Toast {
  public id: number = 0;
  public message: string = '';
  public seconds: number = 0;
  public variant: string = 'default';
  public dismissable: boolean = true;

  from(toast: Toast): Toast {
    this.id = toast.id;
    this.message = toast.message;
    this.seconds = toast.seconds;
    this.variant = toast.variant;
    this.dismissable = toast.dismissable;
    return this;
  }
}
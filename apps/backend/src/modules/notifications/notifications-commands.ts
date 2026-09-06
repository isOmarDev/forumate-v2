interface SendNotificationCommandProps {
  memberId: string;
  correspondingEventName: string;
}

export class SendNotificationCommand {
  constructor(public readonly props: SendNotificationCommandProps) {}
}

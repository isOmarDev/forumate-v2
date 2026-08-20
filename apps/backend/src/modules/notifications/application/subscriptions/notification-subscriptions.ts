import { EventBus } from '@forumate/bus';

import { MemberReputationLevelUpgraded } from '../../../members/domain/events/member-reputation-level-upgraded';
import { SendNotificationCommand } from '../../notification-commands';
import { NotificationsService } from '../notifications-service';

export class NotificationsSubscriptions {
  constructor(
    private eventBus: EventBus,
    private notificationService: NotificationsService,
  ) {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    this.eventBus.subscribe<MemberReputationLevelUpgraded>(
      MemberReputationLevelUpgraded.name,
      this.onMemberReputationLevelUpgraded.bind(this),
    );
  }

  async onMemberReputationLevelUpgraded(event: MemberReputationLevelUpgraded) {
    try {
      const command = new SendNotificationCommand({
        memberId: event.data.memberId,
        correspondingEventName: 'MemberReputationLevelUpgraded',
      });
      await this.notificationService.sendNotification(command);
    } catch (error) {
      console.log(error);
    }
  }
}

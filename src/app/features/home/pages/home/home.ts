import { Component, computed, inject } from '@angular/core';
import { HomeFacade } from '../../facade/home.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiContactCard } from '../../../../shared/ui-components/ui-contact-card/ui-contact-card';
import { TranslateModule } from '@ngx-translate/core';
import { UiInput } from '../../../../shared/ui-components/ui-input/ui-input';
import { FormControl, FormGroup } from '@angular/forms';
import { UiSingleAccordion } from '../../../../shared/ui-components/ui-single-accordion/ui-single-accordion';
import { UiSpinner } from '../../../../shared/ui-components/ui-spinner/ui-spinner';
import { IContactWS } from '../../../../domain/contact.model';
import { UiScrollbar } from '../../../../shared/ui-components/ui-scrollbar/ui-scrollbar';
import { TuiDrawer } from '@taiga-ui/kit';
import { TuiPopup } from '@taiga-ui/core';
import { UiButton } from '../../../../shared/ui-components/ui-button/ui-button';
import { UiContactInfoCard } from '../../../../shared/ui-components/ui-contact-info-card/ui-contact-info-card';
import { UiUserCard } from '../../../../shared/ui-components/ui-user-card/ui-user-card';

@Component({
  selector: 'home',
  imports: [UiInput, UiContactCard, UiSingleAccordion, UiSpinner, UiScrollbar, UiButton, UiContactInfoCard, UiUserCard, TuiDrawer, TuiPopup, TranslateModule],
  templateUrl: './home.html', 
  styleUrl: './home.scss',
})
export class Home {
  private homeFacade = inject(HomeFacade);

  public selectedContact = this.homeFacade.selectedContact;
  public form = new FormGroup({
    contacts: new FormControl<string | null>(null),
    chats: new FormControl<string | null>(null),
  });
  private readonly contactsFilter = toSignal(
    this.form.controls.contacts.valueChanges,
    {initialValue: null}
  );
  private readonly chatsFilter = toSignal(
    this.form.controls.chats.valueChanges,
    {initialValue: null}
  );
  public user = this.homeFacade.user;
  public friends = computed(() => {
    const friends = this.homeFacade.friends();
    const filter = this.contactsFilter();
    return this.filter(friends, filter);
  });
  public subscriptions = computed(() => {
    const subscriptions = this.homeFacade.subscriptions();
    const filter = this.contactsFilter();
    return this.filter(subscriptions, filter);
  });
  public subscribers = computed(() => {
    const subscriptions = this.homeFacade.subscribers();
    const filter = this.contactsFilter();
    return this.filter(subscriptions, filter);
  });
  public chats = computed(() => {
    const chats = this.homeFacade.chats();
    const filter = this.chatsFilter();
    return this.filter(chats, filter);
  });
  public isLoading = this.homeFacade.isContactsLoading;

  private filter(list: IContactWS[], filter: string | null): IContactWS[] {
    if (!filter) return list;
    const value = filter.toLocaleLowerCase().trim();
    return list.filter((item) => 
      item.firstName?.toLocaleLowerCase().includes(value) ||
      item.login?.toLocaleLowerCase().includes(value) ||
      item.phone?.includes(value)
    );
  }

  public lastMessageData(contact: IContactWS): {
    key: string,
    params?: {text: string},
  } {
    const last = this.homeFacade.getLastMessage(contact.id);
    if (!last) {
      return {
        key: "HOME.MESSAGES_EMPTY"
      };
    }
    const isMine = last.fromUserId === this.user().id;
    return {
      key: isMine
        ? "HOME.MESSAGE_YOUR"
        : "HOME.MESSAGE_TO_YOU",
      params: {text: last.content},
    };
  }

  public navigateToChat(contact: IContactWS): void {
    this.homeFacade.navigateToChat(contact.id);
  }

  public selectContact(contact: IContactWS | null): void {
    this.homeFacade.openContactInfo(contact);
  }
}

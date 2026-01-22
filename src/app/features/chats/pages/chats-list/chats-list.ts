import { Component, computed, DestroyRef, inject } from '@angular/core';
import { ChatsFacade } from '../../facade/chats.facade';
import { UiInput } from '../../../../shared/ui-components/ui-input/ui-input';
import { UiContactCard } from '../../../../shared/ui-components/ui-contact-card/ui-contact-card';
import { UiSingleAccordion } from '../../../../shared/ui-components/ui-single-accordion/ui-single-accordion';
import { UiSpinner } from '../../../../shared/ui-components/ui-spinner/ui-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IContactWS } from '../../../../domain/contact.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { UiScrollbar } from "../../../../shared/ui-components/ui-scrollbar/ui-scrollbar";
import { TuiFade } from '@taiga-ui/kit';
import { UiUserCard } from '../../../../shared/ui-components/ui-user-card/ui-user-card';

@Component({
  selector: 'chats',
  imports: [UiInput, UiContactCard, UiSingleAccordion, UiSpinner, UiScrollbar, UiUserCard, TuiFade, TranslateModule, RouterOutlet],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss',
})
export class ChatsList {
  private chatsFacade = inject(ChatsFacade);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public user = this.chatsFacade.user;
  public chatsControl = new FormControl<string | null>(null);
  private readonly chatsInput = toSignal(
    this.chatsControl.valueChanges,
    {initialValue: null},
  );
  
  public isContactsLoading = this.chatsFacade.isContactsLoading;
  public isSearchLoading = this.chatsFacade.isSearchLoading;
  public searchContacts = this.chatsFacade.searchContacts;
  public friends = computed(() => {
    const friends = this.chatsFacade.friends();
    const filter = this.chatsInput();
    return this.filter(friends, filter);
  });
  public subscriptions = computed(() => {
    const subscriptions = this.chatsFacade.subscriptions();
    const filter = this.chatsInput();
    return this.filter(subscriptions, filter);
  });
  public subscribers = computed(() => {
    const subscriptions = this.chatsFacade.subscribers();
    const filter = this.chatsInput();
    return this.filter(subscriptions, filter);
  });
  public readonly selectedChat = this.chatsFacade.selectedChat;

  ngOnInit(): void {
    this.searchSub();
  }

  private searchSub(): void {
    this.chatsControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
      switchMap(value => {
        return this.chatsFacade.search(value)
      }),
    ).subscribe();
  }

  private filter(list: IContactWS[], filter: string | null): IContactWS[] {
    if (!filter) return list;
    const value = filter.toLocaleLowerCase().trim();
    return list.filter((item) => 
      item.firstName?.toLocaleLowerCase().includes(value) ||
      item.login?.toLocaleLowerCase().includes(value) ||
      item.phone?.includes(value)
    );
  }

  public openContact(contact: IContactWS): void {
    const selected = this.selectedChat();
    if (selected && selected.id === contact.id) {
      this.router.navigate(['/main/chats']);
      return;
    }
    this.router.navigate(['/main/chats', contact.id]);
  }

  public lastMessageData(contact: IContactWS): {
    key: string,
    params?: {text: string},
  } {
    const last = this.chatsFacade.getLastMessage(contact.id);
    
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
}

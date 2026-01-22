import { Component, computed, DestroyRef, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UiInput } from '../../../../shared/ui-components/ui-input/ui-input';
import { UiButton } from "../../../../shared/ui-components/ui-button/ui-button";
import { ChatsFacade } from '../../facade/chats.facade';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TuiComment, TuiDrawer } from '@taiga-ui/kit';
import { UiDropdownMenu } from '../../../../shared/ui-components/ui-dropdown-menu/ui-dropdown-menu';
import { UiDropdownClose } from '../../../../shared/ui-directives/ui-dropdown-close.directive';
import { UiContactInfoCard } from '../../../../shared/ui-components/ui-contact-info-card/ui-contact-info-card';
import { UiContactCard } from '../../../../shared/ui-components/ui-contact-card/ui-contact-card';
import { TuiPopup } from '@taiga-ui/core';
import { IContactWS } from '../../../../domain/contact.model';

@Component({
  selector: 'chat',
  imports: [
    UiInput, UiButton, TuiComment, UiDropdownMenu, UiDropdownClose, 
    UiContactInfoCard, UiContactCard, TuiDrawer, TuiPopup, DatePipe, TranslateModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnDestroy {
  private chatsFacade = inject(ChatsFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly paramMap = toSignal(
    this.route.paramMap,
    { initialValue: this.route.snapshot.paramMap }
  );
  private readonly chatId = computed(() => {
    const id = this.paramMap().get('id');
    return id ? Number(id) : null;
  });

  public user = this.chatsFacade.user;
  public open = signal(false);
  public messages = this.chatsFacade.messages;
  public messageControl = new FormControl<string>('', { nonNullable: true });
  public readonly contact = computed(() => {
    const id = this.chatId();
    if (!id) return null;
    this.chatsFacade.ensureContactLoaded(id);
    return this.chatsFacade.getContactById(id)();
  });
  public canAdd = computed(() => {
    const contact = this.contact();
    return contact && contact.status === null;
  });
  public canDelete = computed(() => {
    const contact = this.contact();
    return contact && contact.status === 'ACCEPTED';
  });
  public canCancel = computed(() => {
    const contact = this.contact();
    const user = this.user();
    return contact && contact.status === 'PENDING' && contact.initiatorId === user.id;
  });
  public canApprove = computed(() => {
    const contact = this.contact();
    return contact && contact.status === 'PENDING' && contact.initiatorId === contact.id;
  });

  constructor() {
    effect(() => {
      const contact = this.contact();
      const selected = this.chatsFacade.selectedChat();
      if (contact && (!selected || selected.id !== contact.id)) {
        this.chatsFacade.selectChat(contact);
      }
      if (!contact && selected) {
        this.chatsFacade.selectChat(null);
      }
    });
    effect(() => {
      const contact = this.contact();
      if (!contact || !contact.online) {
        this.messageControl.disable({emitEvent: false});
      } else {
        this.messageControl.enable({emitEvent: false});
      }
    })
  }

  ngOnDestroy(): void {
    this.chatsFacade.selectChat(null);
  }

  public send(): void {
    const value = this.messageControl.value.trim();
    if (!value) return;
    const contact = this.contact();
    if (!contact) return;
    this.chatsFacade.sendMessage(contact.id, value);
    this.messageControl.setValue('');
  }

  public addContact(contact: IContactWS): void {
    this.chatsFacade.add(contact).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  public aproveContact(contact: IContactWS): void {
    this.chatsFacade.approve(contact).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  public deleteFriend(contact: IContactWS): void {
    this.chatsFacade.delete(contact).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  public cancelContact(contact: IContactWS): void {
    this.chatsFacade.cancel(contact).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  public blockContact(contact: IContactWS): void {
    this.chatsFacade.block(contact).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}

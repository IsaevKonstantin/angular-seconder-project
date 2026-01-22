import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PresenceService {
    private readonly version = signal(0);
    private readonly onlineUsers = new Set<number>();

    public handlePresence(event: { userId: number; online: boolean }) {
        if (event.online) {
            this.onlineUsers.add(event.userId);
        } else {
            this.onlineUsers.delete(event.userId);
        }
        this.version.update(v => v + 1);
    }

    public isOnline(userId: number): boolean {
        this.version();
        return this.onlineUsers.has(userId);
    }

    public reset(userIds: number[]) {
        this.onlineUsers.clear();
        userIds.forEach(id => this.onlineUsers.add(id));
        this.version.update(v => v + 1);
    }
}
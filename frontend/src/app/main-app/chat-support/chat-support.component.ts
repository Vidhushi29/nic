import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ApiResponse, User } from 'src/app/model/api-response.model';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';

interface Message {
  text: string;
  sentByCurrentUser: boolean;
  timestamp: Date; 
  user_type: string; 
}

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.css']
})
export class ChatSupportComponent implements OnInit {
  @ViewChild('chatBody') chatBody!: ElementRef;  // Reference to chat body
  searchTerm: string = '';
  newMessage: string = ''; 
  users: User[] = [];
  messages: Message[] = []; 
  filteredUsersList: User[] = [];
  selectedUser: User | null = null; 
  loggedInUserId: number | null = null;
  showSeedDivision = false;
  showNodal = false;
  showPdpc = false;
  showBspc = false;
  showSpp = false;
  showIndenter = false;
  pollingInterval: NodeJS.Timeout;
  // Define total unread counts for each user type
  totalUnreadSeedDivision = 0;
  totalUnreadNodal = 0;
  totalUnreadPdpc = 0;
  totalUnreadBspc = 0;
  totalUnreadSpp = 0;
  totalUnreadIndenter = 0;

  constructor(private _productionCenter: ProductioncenterService, private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveLoggedInUserId();
    this.loadUsers();
    //  Start polling for messages when component initializes
    //  this.startPollingForMessages();
     this.updateUnreadCounts();
  }
  //  // Start polling when user opens a chat
  //  startPollingForMessages() {
  //   // Start polling every 5 seconds (5000 ms)
  //   this.pollingInterval = setInterval(() => {
  //     this.loadMessages();
  //   }, 5000); // Adjust the interval as needed
  // }

  // Stop polling when component is destroyed or user switches chat
  // ngOnDestroy() {
  //   this.stopPollingForMessages();
  // }

  // stopPollingForMessages() {
  //   if (this.pollingInterval) {
  //     clearInterval(this.pollingInterval);
  //   }
  // } 
     // Function to update total unread messages per user type
     updateUnreadCounts(): void {
      this.totalUnreadSeedDivision = this.getUnreadCountByType('SD');
      this.totalUnreadNodal = this.getUnreadCountByType('ICAR', 'HICAR');
      this.totalUnreadPdpc = this.getUnreadCountByType('BR'); 
      this.totalUnreadBspc = this.getUnreadCountByType('BPC');
      this.totalUnreadSpp = this.getUnreadCountByType('SPP');
      this.totalUnreadIndenter = this.getUnreadCountByType('IN'); 
    }
    
  // Example: Parsing response data correctly
// const users: User[] = response.data.map((user: any) => ({
//   ...user,
//   unreadCount: parseInt(user.unreadCount, 10),  // Convert unreadCount to a number
// }));

  // Function to calculate unread messages for specific user types
  getUnreadCountByType(...types: string[]): number {
    // Filter users by user_type and sum up unreadCount
    return this.users
      .filter((user: User) => types.includes(user.user_type))  // user_type is a string
      .reduce((sum, user) => sum + (user.unreadCount || 0), 0);  // unreadCount is now a number
 
  }
  
  
  
  retrieveLoggedInUserId(): void {
    const storedUser = localStorage.getItem('BHTCurrentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.loggedInUserId = user.id;
        console.log('Logged-in User ID:', this.loggedInUserId);
      } catch (error) {
        console.error('Error parsing stored user data', error);
      }
    } else {
      console.error('Logged-in user data not found in local storage');
    }
  }

   
  loadUsers(): void {
    const route = 'get-chat-support-users';
    const payload = {
      loginedUserid: {
        id: this.loggedInUserId
      }
    };
  
    this._productionCenter.postRequestCreator(route, payload).subscribe(res => {
      if (res && res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.users = res.EncryptedResponse.data.map(user => ({
          ...user,
          unreadCount: parseInt(user.unreadCount, 10) || 0 // Convert unreadCount to a number
        }));
  
        // Sort users by the time of the latest message
        this.users = this.sortUsersByLatestMessage(this.users);
        this.filteredUsersList = this.users;

        // Update unread counts after loading users
        this.updateUnreadCounts();
      } else {
        console.error('Failed to load users');
        this.users = [];
        this.filteredUsersList = [];
      }
    }, error => {
      console.error('Error loading users', error);
      this.users = [];
      this.filteredUsersList = [];
    });
  }
  toggleDropdown(category: string) {
    // Clear the search term and reset the filtered users list
    this.searchTerm = '';   
    this.filteredUsersList = this.users; // Reset filteredUsers to show all users
    // If the clicked dropdown is already open, close it by toggling its state to false
    if (category === 'seedDivision') {
      this.showSeedDivision = !this.showSeedDivision;
      this.showNodal = false;
      this.showPdpc = false;
      this.showBspc = false;
      this.showSpp = false;
      this.showIndenter = false;
    } else if (category === 'nodal') {
      this.showNodal = !this.showNodal;
      this.showSeedDivision = false;
      this.showPdpc = false;
      this.showBspc = false;
      this.showSpp = false;
      this.showIndenter = false;
    } else if (category === 'pdpc') {
      this.showPdpc = !this.showPdpc;
      this.showSeedDivision = false;
      this.showNodal = false;
      this.showBspc = false;
      this.showSpp = false;
      this.showIndenter = false;
    } else if (category === 'bspc') {
      this.showBspc = !this.showBspc;
      this.showSeedDivision = false;
      this.showNodal = false;
      this.showPdpc = false;
      this.showSpp = false;
      this.showIndenter = false;
    }else if (category === 'spp') {
      this.showSpp = !this.showSpp;
      this.showSeedDivision = false;
      this.showNodal = false;
      this.showPdpc = false;
      this.showBspc = false;
      this.showIndenter = false;
    } else if (category === 'indenter') {
      this.showIndenter = !this.showIndenter;
      this.showSeedDivision = false;
      this.showNodal = false;
      this.showPdpc = false;
      this.showSpp = false;
      this.showBspc = false;
    }
  }
   
  // Function to filter users by user_type
  filteredUsersByType(...userTypes: string[]) {
    return this.filteredUsersList.filter(user => userTypes.includes(user.user_type));
  }
  
  // sortUsersByLatestMessage(users: User[]): User[] {
  //   return users.sort((a, b) => {
  //     const unreadB = b.unreadCount || 0;
  //     const unreadA = a.unreadCount || 0;
  
  //     // Sort by unread count first
  //     if (unreadA !== unreadB) {
  //       return unreadB - unreadA; // Show users with unread messages first
  //     }
  
  //     const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
  //     const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
  
  //     // Sort by latest message time if there are unread messages
  //     if (timeA !== timeB) {
  //       return timeB - timeA; // Sort by latest message time
  //     }
  
  //     // If the time and unread count are the same, sort alphabetically
  //     return a.name.localeCompare(b.name);
  //   });
  // }
  sortUsersByLatestMessage(users: User[]): User[] {
    return users.sort((a, b) => {
      const unreadB = b.unreadCount || 0;
      const unreadA = a.unreadCount || 0;
  
      // Sort by unread count first
      if (unreadA !== unreadB) {
        return unreadB - unreadA; // Show users with unread messages first
      }
  
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
  
      // Sort by latest message time if there are unread messages
      if (timeA !== timeB) {
        return timeB - timeA; // Sort by latest message time
      }
  
      // If the time and unread count are the same, sort alphabetically by name
      const nameA = a.name || ''; // Default to empty string if name is null/undefined
      const nameB = b.name || ''; // Default to empty string if name is null/undefined
  
      return nameA.localeCompare(nameB);
    });
  }
  

  onSearchChange(): void {
    this.filteredUsersList = this.filteredUsers();
  }

  // filteredUsers(): User[] {
  //   const searchTermLower = this.searchTerm.toLowerCase();
  //   return this.users.filter(user =>
  //     user.name.toLowerCase().includes(searchTermLower) ||
  //     (user.email_id && user.email_id.toLowerCase().includes(searchTermLower)) ||
  //     (user.mobile_number && user.mobile_number.toLowerCase().includes(searchTermLower))
  //   );
  // }
  filteredUsers(): User[] {
    const searchTermLower = this.searchTerm.toLowerCase();
    return this.users.filter(user =>
      (user.name && user.name.toLowerCase().includes(searchTermLower)) ||
      (user.email_id && user.email_id.toLowerCase().includes(searchTermLower)) ||
      (user.mobile_number && user.mobile_number.toLowerCase().includes(searchTermLower))
    );
  }
  

  deselectUser(): void {
    this.selectedUser = null;
    this.messages = [];
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser) {
      const newMsg: Message = {
        text: this.newMessage,
        sentByCurrentUser: true,
        timestamp: new Date(),
        user_type: ''
      };
      this.messages.push(newMsg);
      this.updateLastMessage(newMsg);

      this.saveMessage(newMsg).then(success => {
        if (success) {
          setTimeout(() => {
            const replyMsg: Message = {
              text: 'Reply to: ' + newMsg.text,
              sentByCurrentUser: false,
              timestamp: new Date(),
              user_type: ''
            };
            this.messages.push(replyMsg);
            this.updateLastMessage(replyMsg);
            this.saveMessage(replyMsg);
            this.scrollToBottom(); // Scroll to bottom when user is selected
          }, 1000);
        }
      });

      this.newMessage = '';
      this.scrollToBottom(); // Scroll to bottom when user is selected
    }
    this.updateUnreadCounts();
  }

  updateLastMessage(message: Message): void {
    if (this.selectedUser) {
      const user = this.users.find(u => u.id === this.selectedUser!.id);
      if (user) {
        user.lastMessage = message.text;
        user.lastMessageTime = message.timestamp;
        if (!message.sentByCurrentUser) {
          user.unreadCount = (user.unreadCount || 0) + 1;
        }
        this.users = this.sortUsersByLatestMessage(this.users);
        this.filteredUsersList = this.sortUsersByLatestMessage(this.filteredUsersList);
      }
    }
  }

  saveMessage(message: Message): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.selectedUser) {
        const payload = {
          sender_id: this.loggedInUserId,
          receiver_id: this.selectedUser.id,
          msg: message.text,
          created_at: message.timestamp,
          updated_at: message.timestamp,
          is_active: 1
        };

        const route = 'save-chat-message';
        this._productionCenter.postRequestCreator(route, payload).subscribe(res => {
          if (res && res.status_code === 201) {
            console.log('Message saved successfully:', res.data);
            resolve(true);
          }  
        }, error => {
          console.error('Error saving message', error);
          resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }
  
  
  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadMessages(); 
    this.markMessagesAsRead(); 
    // this.updateUnreadCounts();
  }
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }, 0);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
  loadMessages(): void {
    if (this.selectedUser) {
      const payload = {
        sender_id: this.loggedInUserId,
        receiver_id: this.selectedUser.id
      };

      const route = 'get-saved-messages';
      this._productionCenter.postRequestCreator(route, payload).subscribe(res => {
        if (res && res.status_code === 200) {
          this.messages = res.data.map((msg: any) => ({
            text: msg.msg,
            sentByCurrentUser: msg.sender_id === this.loggedInUserId,
            timestamp: new Date(msg.created_at)
          })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          // Scroll to bottom after messages have been loaded and rendered
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
        } else {
          console.error('Failed to load messages');
          this.messages = [];
        }
      }, error => {
        console.error('Error loading messages', error);
        this.messages = [];
      });
    } else {
      this.messages = [];
    }
  }
  // scrollToBottom(): void {
  //   try {
  //     setTimeout(() => {
  //       if (this.chatBody) {
  //         this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
  //       }
  //     }, 0);
  //   } catch (err) {
  //     console.error('Error scrolling to bottom:', err);
  //   }
  // }
  markMessagesAsRead(): void {
    if (this.selectedUser) {
      const route = 'mark-messages-read';
      const payload = {
        sender_id: this.selectedUser.id,
        receiver_id: this.loggedInUserId
      };

      this._productionCenter.postRequestCreator(route, payload).subscribe(res => {
        if (res && res.status_code === 200) {
          const user = this.users.find(u => u.id === this.selectedUser!.id);
          if (user) {
            user.unreadCount = 0;
            this.filteredUsersList = this.filteredUsers();
          }
        } else {
          console.error('Failed to mark messages as read');
        }
      }, error => {
        console.error('Error marking messages as read', error);
      });
    }
  }

  formatTimestamp(timestamp: string | Date): string {
    const date = new Date(timestamp);
  
    // Convert to Indian Standard Time (IST)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
  
    return date.toLocaleString('en-IN', options);
  }
  
  
  
}

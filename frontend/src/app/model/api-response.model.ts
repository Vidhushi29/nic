export interface User {
    messages: any;
    unreadCount: number;
    mobile: any;
    email: any;
    id: number;
    name: string;
    lastMessage: string;
    lastMessageTime: Date;
    email_id: string;
    user_type: string;
    mobile_number: string;
    code: string | null; 
  }
  
  export interface EncryptedResponse {
    status_code: number;
    message: string;
    data: User[];
  }
  
  export interface ApiResponse {
    EncryptedResponse: EncryptedResponse;
  }
  
const status = {
    OK: 'OK',
    INVALID_CREDENTIAL : 'User credentials that you\'ve entered is incorrect, please try again.',
    REQUEST_DATA_MISSING: 'Request data can\'t be empty!',
    INSECURE_API_CALL: 'API payload is not encrypted!',
    UNEXPECTED_ERROR: 'Something went wrong!',
    OTP_CONFIRM: 'Verify your OTP',
    OTP_SENT: 'OTP successfully sent',
    INVALID_OTP: 'The OTP you\'ve entered is incorrect, please try again.',
    OTP_EXPIRE: 'The OTP you\'ve entered has expired, please resend and try again.',
    LOGIN_SUCCESS: 'Login successfully',
    OTP_SUCCESS: 'OTP successfully verified',
    MOBILE_EXIST: 'Mobile number already exist',
    EMAIL_EXIST: 'Email already exist',
    Id_NOT_FOUND: 'The Email Id or Mobile No. that you\'ve entered is not found, please try again.',
    ID_NOT_FOUND: 'The Email Id or Mobile No. that you\'ve entered is not found, please try again.',
    BLACKLISTED: 'Your account is blacklisted',
    NOT_HUMAN: 'Verify that you are not a robot',
    PASSWORD_RESET_SUCCESS: 'Password successfully reset',
    PASSWORD_RESET_EXPIRE: 'Link Expire',
    LIST_NOT_AVAILABLE: 'List not available',
    CITY_FOUND: 'City list fetched successfully',
    STATE_FOUND: 'State list fetched successfully',
    GENDER_FOUND: 'Gender list fetched successfully',
    MARITAL_LIST_FOUND: 'Marital list fetched successfully',
    INCOME_LIST_FOUND: 'Income list fetched successfully',
    EMPCODE_USED: 'Employee code already in use',
    INVALID_EMPCODE: 'Invalid Employee code',
    INVALID_REFFERCODE: 'Invalid Reference code',
    INVALID_TOKEN: 'Invalid token',
    EXPIRE_TOKEN: 'Token Expire',
    LOG_OUT: 'Logout successfully',
    LOG_OUT_ALL_DEVICE: 'Logout successfully from all device',
    INVALID_FILE_FORMAT: 'Customer list uploaded is invalid',
    DATA_NOT_AVAILABLE: 'Data not found',
    DATA_AVAILABLE: 'Data found successfully',
    POLICY_EXIST: 'This policy number already exist',
    POLICY_UPLOAD: 'Policy upload successfully',
    INSURER_LIST_FOUND: 'Insurer list fetched successfuly',
    STOP_POLICY_ALERT: 'You have stoped policy alert successfuly',
    POLICY_STATUS_UPDATED: 'You have updated policy status successfuly',
    UPDATE_PROFILE_IMAGE: 'Profile image updated successfuly',
    UPDATE_PROFILE: 'Profile updated successfuly',
    PASSWORD_NOT_MATCH: 'The Old Password you\'ve entered is incorrect, please try again.',
    DATA_UPDATED: 'Data updated',
    DATA_SAVE: 'Data saved succesfully',
    ACCOUNT_VERIFIED: 'Account verified',
    DATA_VERIFIED: 'Data verified',
    ACCOUNT_PENDING: 'Account under review',
    DATA_NOT_SAVE: 'Data Not Saved',
    MERCHANT_DATA_MISSING: "Merchant name missing",
    DATA_DELETED: "Data Deleted",
    REPORT_SENT: "Report sent",
    INSUFFICIENT_POINT: "You have insufficient points to avail this offer",
    NO_REWARD_GIFT_POINT: "You have reached your max limit to avail reward gift voucher",
    INSUFFICIENT_REWARD_GIFT_POINT: "You have insufficient reward points to avail this voucher",
    ALREADY_LIKED: "Already Liked",
    LIKED_OFFER: "Like Offer",
    OFFER_UNLIKE: "Unlike Offer",
    ALREADY_UNLIKED: "Already Unliked",
    ID_NOT_EXIST: 'Invalid offer id',
    OFFER_TYPE_VALIDATION: "Invalid offer type",
    BOOKING_SUCCESSFUL: "Booking Successful",
    UNAUTHORIZED_USER: "You are not authorized to access this resource",
    NOT_CAMPAIGN_USER: "You are not authorized/campaign user",
    ALREADY_AVAILED: "You have already availed this offer",
    OFFER_HAS_EXPIRE: "This offer has expired or not available",
    COUPON_NOT_AVAILABLE: "Coupons for this offer has expired or not available",
    USER_ADDED: "User Successfully Added",
    USER_CREATED: "User Created Successfully",
    POLICY_ALREADY_UPLOAD: "This Policy Number belongs to someone else",
    USER_NOT_EXIST: "User not registered",
    USER_EXIST: "User already registered",
    INVITE_SUCCESSFULY: "Invite successfuly",
    REVIEW_SUBMIT : "Review submit successfuly",
    ADVISER_NOT_EXIST: "Adviser not exist",
    ADVISER_BLOCKED: "Adviser blocked successfuly",
    MEETING_CREATED: "Meeting Created Successfully",
    ALREADY_OTP_SENT: "Already OTP sent",
    DB_DATA_MISSING: 'No data exists!',
    NOT_OFFICER:"Please select officers only",
    TOKEN_VARIFIED:"Token varified.",
    BAD_REQUEST: 'BAD REQUEST',
    INSPECTION_ALREADY_SUBMITTED: 'Inspection already submitted',
    INSPECTION_SUBMITTED: 'Inspection submitted',

    CROP_CODE_REQUIRED: 'Crop code is Required',
    NOTIFICATION_YEAR_REQUIRED: 'Notification year is Required'
}

module.exports = status
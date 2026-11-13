const BASE_URL =
  'https://characteristically-unsecreting-chasity.ngrok-free.dev';

// =====================================================
// Send OTP API
// =====================================================

export const sendOtp = async (
  identifier: string,
) => {
  const response = await fetch(
    `${BASE_URL}/auth/send-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
      }),
    },
  );

  return response.json();
};

// =====================================================
// Verify OTP API
// =====================================================

export const verifyOtp = async (
  identifier: string,
  otp: string,
) => {
  const response = await fetch(
    `${BASE_URL}/auth/verify-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        otp,
      }),
    },
  );

  return response.json();
};

// =====================================================
// Get User Profile API
// =====================================================

export const getUserProfile = async (
  userId: number,
) => {
  const response = await fetch(
    `${BASE_URL}/users/profile/${userId}`,
  );

  return response.json();
};

// =====================================================
// Register User API
// =====================================================

export const registerUser = async (
  userData: any,
) => {
  const response = await fetch(
    `${BASE_URL}/users/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    },
  );

  return response.json();
};

// =====================================================
// Upload Profile Image API
// =====================================================

export const uploadProfileImage = async (
  image: any,
) => {
  const formData = new FormData();

  formData.append('file', {
    uri: image.uri,
    type:
      image.type ||
      'image/jpeg',
    name:
      image.fileName ||
      'profile.jpg',
  } as any);

  const response = await fetch(
    `${BASE_URL}/upload/profile`,
    {
      method: 'POST',
      body: formData,
    },
  );

  return response.json();
};

// =====================================================
// Save Horoscope / Birth Details API
// =====================================================

export const saveHoroscope = async (
  horoscopeData: any,
) => {
  const response = await fetch(
    `${BASE_URL}/horoscope`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        horoscopeData,
      ),
    },
  );

  return response.json();
};

// =====================================================
// Get Horoscope API
// =====================================================

export const getHoroscope = async (
  horoscopeData: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  },
) => {
  const response = await fetch(
    `${BASE_URL}/horoscope/view`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        horoscopeData,
      ),
    },
  );

  return response.json();
};

// =====================================================
// Upload Horoscope Image / PDF API
// =====================================================

export const uploadHoroscope = async (
  file: any,
) => {
  if (!file?.uri) {
    return {
      success: false,
      message: 'Please select a horoscope image or PDF first.',
    };
  }

  const fileName =
    file.name ||
    file.fileName ||
    'horoscope';

  const extension = fileName
    .split('.')
    .pop()
    ?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    pdf: 'application/pdf',
  };

  let mimeType = String(file.type || '').toLowerCase();

  if (mimeType === 'image/jpg') {
    mimeType = 'image/jpeg';
  }

  if (
    !mimeType ||
    mimeType === 'application/octet-stream' ||
    mimeType === 'binary/octet-stream'
  ) {
    mimeType =
      mimeTypes[extension || ''] ||
      'application/octet-stream';
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];

  if (!allowedTypes.includes(mimeType)) {
    return {
      success: false,
      message: 'Please select a JPG, JPEG, PNG, or PDF file.',
    };
  }

  const formData = new FormData();

  // Keep this field name in sync with the backend FileInterceptor('file').
  formData.append(
    'file',
    {
      uri: file.uri,
      type: mimeType,
      name: fileName,
    } as any,
  );

  try {
    const response = await fetch(
      `${BASE_URL}/horoscope/upload`,
      {
        method: 'POST',
        // Do not set Content-Type manually; fetch adds the multipart boundary.
        body: formData,
      },
    );

    const responseText = await response.text();
    let data: any = null;

    try {
      data = JSON.parse(responseText);
    } catch {
      // The server may return HTML/text for a proxy or server error.
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          data?.message ||
          `Horoscope upload failed. Server returned HTTP ${response.status}.`,
      };
    }

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        message:
          'The server returned an invalid response. Check the backend logs and BASE_URL.',
      };
    }

    return data;
  } catch (error) {
    console.error('Horoscope upload request failed:', error);

    return {
      success: false,
      message:
        'Unable to connect to the backend. Check your internet connection, backend status, and BASE_URL.',
    };
  }
};

// =====================================================
// Start Assessment API
// =====================================================

export const startAssessment = async ({
  userId,
  assessmentType,
}: {
  userId: number;
  assessmentType: string;
}) => {
  const response = await fetch(
    `${BASE_URL}/assessment/start`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        assessmentType,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to start assessment: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Save Assessment Answers API
// =====================================================

export const saveAssessmentAnswers = async ({
  userId,
  assessmentType,
  answers,
}: {
  userId: number;
  assessmentType: string;
  answers: any[];
}) => {
  const response = await fetch(
    `${BASE_URL}/assessment/answers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        assessmentType,
        answers,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to save assessment answers: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Complete Assessment API
// =====================================================

export const completeAssessment = async ({
  userId,
  assessmentType,
  answers,
  result,
}: {
  userId: number;
  assessmentType: string;
  answers: any[];
  result: any;
}) => {
  const response = await fetch(
    `${BASE_URL}/assessment/complete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        assessmentType,
        answers,
        result,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to complete assessment: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Get Assessment API
// =====================================================

export const getAssessment = async ({
  userId,
  assessmentType,
}: {
  userId: number;
  assessmentType: string;
}) => {
  const url =
    `${BASE_URL}/assessment` +
    `?userId=${userId}` +
    `&assessmentType=${assessmentType}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to get assessment: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Get All Assessment Statuses API
// =====================================================

export const getAssessmentStatuses = async (
  userId: number,
) => {
  const response = await fetch(
    `${BASE_URL}/assessment/status/${userId}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get assessment statuses: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Get AI Insights API
// =====================================================

export const getAiInsights = async (
  userId: number,
) => {
  const response = await fetch(
    `${BASE_URL}/ai-insights/${userId}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get AI insights: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Get Complete Swadharma Report API
// =====================================================

export const getCompleteSwadharmaReport = async (
  userId: number,
) => {
  const response = await fetch(
    `${BASE_URL}/swadharma-report/${userId}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get complete report: ${response.status}`,
    );
  }

  return response.json();
};

// =====================================================
// Send Family Feedback Invitation API
// =====================================================

export const sendFamilyFeedbackInvitation = async ({
  participantId,
  name,
  email,
  relationship,
}: {
  participantId: number;
  name: string;
  email: string;
  relationship: string;
}) => {
  const response = await fetch(
    `${BASE_URL}/family-feedback/invitation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participantId,
        name,
        email,
        relationship,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Failed to send family feedback invitation.',
    );
  }

  return data;
};
// =====================================================
// Save Individual Assessment Step Without Losing Previous Answers
// =====================================================

export const saveAssessmentStep = async ({
  userId,
  assessmentType,
  stepAnswer,
}: {
  userId: number;
  assessmentType: string;
  stepAnswer: any;
}) => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('A valid user ID is required.');
  }

  if (!stepAnswer?.step) {
    throw new Error('Assessment step name is missing.');
  }

  // Ensure that the assessment record exists.
  await startAssessment({
    userId,
    assessmentType,
  });

  // Fetch answers already saved for this assessment.
  const existingAssessment = await getAssessment({
    userId,
    assessmentType,
  });

  const previousAnswers = Array.isArray(existingAssessment?.answers)
    ? existingAssessment.answers
    : [];

  // Replace only the current step and keep all other saved steps.
  const updatedAnswers = [
    ...previousAnswers.filter(
      (item: any) => item?.step !== stepAnswer.step,
    ),
    stepAnswer,
  ];

  // The backend replaces the answers array, so send the merged array.
  return saveAssessmentAnswers({
    userId,
    assessmentType,
    answers: updatedAnswers,
  });
};

// =====================================================
// CREATE SUPPORT TICKET API
// =====================================================

export const createSupportTicket = async ({
  userId,
  subject,
  category,
  description,
}: {
  userId: number;
  subject: string;
  category: string;
  description: string;
}) => {
  const response = await fetch(
    `${BASE_URL}/support/tickets`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        subject,
        category,
        description,
      }),
    },
  );

  const responseText = await response.text();

  let data: any = null;

  try {
    data = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    throw new Error(
      `Support API returned an invalid response (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ||
        `Support request failed (HTTP ${response.status}).`;

    throw new Error(message);
  }

  if (!data?.success || !data?.ticket?.ticketNumber) {
    throw new Error(
      data?.message ||
        'The support ticket response was incomplete.',
    );
  }

  return data;
};
// =====================================================
// NOTIFICATION APIs
// =====================================================

/**
 * Shared request helper for Notification Centre endpoints.
 * Uses the existing BASE_URL declared at the top of this file.
 */
const notificationApiRequest = async (
  endpoint: string,
  method: 'GET' | 'PATCH' | 'DELETE' = 'GET',
) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const responseText = await response.text();
  let data: any = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error('The notification API returned an invalid response.');
      }
    }
  }

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ||
        `Notification request failed (HTTP ${response.status}).`;

    throw new Error(message);
  }

  return data;
};

// =====================================================
// GET NOTIFICATIONS FOR A USER
// GET /notifications/user/:userId
// =====================================================
export const getNotifications = async (
  userId: number | string,
) => {
  if (!userId) {
    throw new Error('A valid user ID is required to load notifications.');
  }

  return notificationApiRequest(
    `/notifications/user/${encodeURIComponent(String(userId))}`,
  );
};

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// GET /notifications/user/:userId/unread-count
// =====================================================
export const getUnreadNotificationCount = async (
  userId: number | string,
) => {
  if (!userId) {
    throw new Error('A valid user ID is required to get unread notifications.');
  }

  return notificationApiRequest(
    `/notifications/user/${encodeURIComponent(String(userId))}/unread-count`,
  );
};

// =====================================================
// MARK ONE NOTIFICATION AS READ
// PATCH /notifications/user/:userId/:notificationId/read
// =====================================================
export const markNotificationAsRead = async (
  userId: number | string,
  notificationId: number | string,
) => {
  if (!userId || !notificationId) {
    throw new Error('User ID and notification ID are required.');
  }

  return notificationApiRequest(
    `/notifications/user/${encodeURIComponent(String(userId))}/${encodeURIComponent(String(notificationId))}/read`,
    'PATCH',
  );
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /notifications/user/:userId/read-all
// =====================================================
export const markAllNotificationsAsRead = async (
  userId: number | string,
) => {
  if (!userId) {
    throw new Error('A valid user ID is required.');
  }

  return notificationApiRequest(
    `/notifications/user/${encodeURIComponent(String(userId))}/read-all`,
    'PATCH',
  );
};

// =====================================================
// DELETE ONE NOTIFICATION
// DELETE /notifications/user/:userId/:notificationId
// =====================================================
export const deleteNotification = async (
  userId: number | string,
  notificationId: number | string,
) => {
  if (!userId || !notificationId) {
    throw new Error('User ID and notification ID are required.');
  }

  return notificationApiRequest(
    `/notifications/user/${encodeURIComponent(String(userId))}/${encodeURIComponent(String(notificationId))}`,
    'DELETE',
  );
};
import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {createSupportTicket} from '../services/api';

type Page = 'home' | 'ticket' | 'requests';
type SupportTicket = {
  id: number;
  ticketNumber: string;
  subject: string;
  category: string;
  description: string;
  status: string;
  priority?: string;
  createdAt?: string;
  adminNotified?: boolean;
};

const categories = [
  {id: 'All', title: 'All Topics', icon: 'apps'},
  {id: 'Account', title: 'Account & Login', icon: 'account-outline'},
  {id: 'Assessment', title: 'Assessments', icon: 'clipboard-list-outline'},
  {id: 'Horoscope', title: 'Horoscope', icon: 'zodiac-leo'},
  {id: 'Report', title: 'Reports & ID Card', icon: 'file-document-outline'},
];

const faqs = [
  {
    id: '1',
    category: 'Account',
    question: 'How do I register on Swadharma?',
    answer: 'Open the registration screen, enter your details and complete the mobile OTP verification process.',
  },
  {
    id: '2',
    category: 'Account',
    question: 'What should I do if I do not receive an OTP?',
    answer: 'Check your mobile number and network connection. Request a new OTP after the resend option becomes available.',
  },
  {
    id: '3',
    category: 'Account',
    question: 'Can I update my profile details?',
    answer: 'You can manage your available profile information through your Swadharma profile section.',
  },
  {
    id: '4',
    category: 'Assessment',
    question: 'What is the Swadharma assessment journey?',
    answer: 'Your journey contains assessments such as Dosha, Guna, Personality and Interest, and Johari Window. Complete the available assessments to build your Swadharma profile.',
  },
  {
    id: '5',
    category: 'Assessment',
    question: 'Can I continue an incomplete assessment?',
    answer: 'Open My Journey from the dashboard to view your assessment progress and continue an incomplete assessment.',
  },
  {
    id: '6',
    category: 'Assessment',
    question: 'How can I check my assessment progress?',
    answer: 'Your Dashboard displays your Swadharma Journey progress and the status of your assessments.',
  },
  {
    id: '7',
    category: 'Horoscope',
    question: 'How do I upload my horoscope?',
    answer: 'Open the birth details or horoscope section and select your horoscope image or PDF file for upload.',
  },
  {
    id: '8',
    category: 'Horoscope',
    question: 'Can I edit my birth details?',
    answer: 'Open your birth details section to review the information and use the available editing options.',
  },
  {
    id: '9',
    category: 'Report',
    question: 'How can I view my Swadharma Report?',
    answer: 'Open Swadharma Report from the sidebar. Report availability depends on the required assessment data.',
  },
  {
    id: '10',
    category: 'Report',
    question: 'How can I get my Swadharma ID Card?',
    answer: 'Open Swadharma ID Card from the sidebar to view your generated ID card and available actions.',
  },
];

const supportCategories = [
  'Account & Login',
  'Assessments',
  'Horoscope',
  'Reports & ID Card',
  'Technical Issue',
  'Other',
];

const HelpSupportScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userId = route.params?.userId;

  const [page, setPage] = useState<Page>('home');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Account & Login');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedTicket, setLastSubmittedTicket] =
    useState<SupportTicket | null>(null);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return faqs.filter(item => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const handleBack = () => {
    if (page !== 'home') {
      setPage('home');
      return;
    }
    navigation.goBack();
  };

  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        activeOpacity={0.7}>
        <MaterialCommunityIcons name="arrow-left" size={26} color="#FF6B00" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpace} />
    </View>
  );

  // Submit the support request to NestJS. The backend saves the ticket
  // first and then sends the notification email to SUPPORT_ADMIN_EMAIL.
  const handleSubmitTicket = async () => {
    if (isSubmitting) return;

    if (!ticketSubject.trim()) {
      Alert.alert('Required', 'Please enter a ticket subject.');
      return;
    }

    if (!ticketDescription.trim()) {
      Alert.alert('Required', 'Please describe your issue.');
      return;
    }

    const numericUserId = Number(userId);
    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      Alert.alert(
        'User ID Missing',
        'Please log in again before raising a support request.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createSupportTicket({
        userId: numericUserId,
        subject: ticketSubject.trim(),
        category: ticketCategory,
        description: ticketDescription.trim(),
      });

      const savedTicket: SupportTicket = result.ticket;
      setLastSubmittedTicket(savedTicket);
      setTicketSubject('');
      setTicketDescription('');
      setTicketCategory('Account & Login');
      setPage('requests');

      if (result.emailNotificationSent) {
        Alert.alert(
          'Ticket Submitted',
          `Your support request has been saved successfully.\n\nTicket Number: ${savedTicket.ticketNumber}\n\nThe admin has been notified by email.`,
        );
      } else {
        Alert.alert(
          'Ticket Saved',
          `Your ticket ${savedTicket.ticketNumber} has been saved, but the admin email notification could not be sent. The support team will need to check the email configuration.`,
        );
      }
    } catch (error) {
      console.error('Support ticket submission failed:', error);
      Alert.alert(
        'Submission Failed',
        error instanceof Error
          ? error.message
          : 'Unable to submit your support request. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategories = () => (
    <View style={styles.topicSection}>
      <Text style={styles.sectionTitle}>Browse Help Topics</Text>
      <Text style={styles.sectionSubtitle}>
        Select a topic to find relevant answers.
      </Text>

      <View style={styles.topicGrid}>
        {categories.map((item, index) => {
          const selected = selectedCategory === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.topicCard,
                index === categories.length - 1 && styles.topicCardFull,
                selected && styles.topicCardSelected,
              ]}
              onPress={() => {
                setSelectedCategory(item.id);
                setExpandedFaq(null);
              }}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.topicIconContainer,
                  selected && styles.selectedTopicIcon,
                ]}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={23}
                  color={selected ? '#FFFFFF' : '#FF6B00'}
                />
              </View>
              <Text
                style={[
                  styles.topicCardText,
                  selected && styles.topicCardTextSelected,
                ]}>
                {item.title}
              </Text>
              {selected && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderFaqs = () => (
    <View style={styles.faqSection}>
      <View style={styles.faqHeading}>
        <View style={styles.faqHeadingText}>
          <Text style={styles.sectionTitle}>
            Frequently Asked Questions
          </Text>
          <Text style={styles.sectionSubtitle}>
            Find answers to common questions.
          </Text>
        </View>
        <View style={styles.faqCountBadge}>
          <Text style={styles.faqCount}>{filteredFaqs.length}</Text>
        </View>
      </View>

      {filteredFaqs.length === 0 ? (
        <View style={styles.noResults}>
          <MaterialCommunityIcons
            name="magnify-close"
            size={38}
            color="#B5AAA1"
          />
          <Text style={styles.noResultsText}>
            No matching questions found.
          </Text>
          <Text style={styles.noResultsSubtitle}>
            Try another search or category.
          </Text>
        </View>
      ) : (
        filteredFaqs.map(item => {
          const expanded = expandedFaq === item.id;
          return (
            <View
              key={item.id}
              style={[
                styles.faqCard,
                expanded && styles.faqCardExpanded,
              ]}>
              <TouchableOpacity
                style={styles.faqQuestion}
                activeOpacity={0.8}
                onPress={() =>
                  setExpandedFaq(expanded ? null : item.id)
                }>
                <View style={styles.faqQuestionIcon}>
                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={22}
                    color="#FF6B00"
                  />
                </View>
                <View style={styles.faqQuestionContent}>
                  <Text style={styles.faqCategoryLabel}>
                    {item.category}
                  </Text>
                  <Text style={styles.questionText}>
                    {item.question}
                  </Text>
                </View>
                <View style={styles.faqArrow}>
                  <MaterialCommunityIcons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#FF6B00"
                  />
                </View>
              </TouchableOpacity>

              {expanded && (
                <View style={styles.answerContainer}>
                  <View style={styles.answerDivider} />
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </View>
  );

  // =====================================================
  // TICKET FORM
  // =====================================================
  if (page === 'ticket') {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader('Raise a Ticket')}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.formIntro}>
            <View style={styles.formIcon}>
              <MaterialCommunityIcons
                name="ticket-outline"
                size={35}
                color="#FF6B00"
              />
            </View>
            <Text style={styles.formTitle}>How can we help you?</Text>
            <Text style={styles.formSubtitle}>
              Tell us about the issue. Our support team will be able to assist you.
            </Text>
          </View>

          <Text style={styles.inputLabel}>Issue Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your issue"
            placeholderTextColor="#A59B94"
            value={ticketSubject}
            onChangeText={setTicketSubject}
            maxLength={160}
            editable={!isSubmitting}
          />

          <Text style={styles.inputLabel}>Select Category *</Text>
          <View style={styles.ticketCategoryGrid}>
            {supportCategories.map(item => {
              const selected = ticketCategory === item;
              return (
                <TouchableOpacity
                  key={item}
                  disabled={isSubmitting}
                  onPress={() => setTicketCategory(item)}
                  style={[
                    styles.categoryOption,
                    selected && styles.categoryOptionSelected,
                  ]}>
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selected && styles.categoryOptionTextSelected,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.inputLabel}>Describe Your Issue *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Please explain your issue in detail..."
            placeholderTextColor="#A59B94"
            multiline
            textAlignVertical="top"
            value={ticketDescription}
            onChangeText={setTicketDescription}
            maxLength={5000}
            editable={!isSubmitting}
          />

          <Text style={styles.optionalText}>* Required fields</Text>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isSubmitting && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmitTicket}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>
                  Submitting...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Submit Support Request
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={21}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.formNote}>
            A ticket reference number will be generated after submission.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================================================
  // MY SUPPORT REQUESTS
  // Note: full ticket history requires a GET tickets API.
  // This screen displays the ticket submitted in this session.
  // =====================================================
  if (page === 'requests') {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader('My Support Requests')}
        <ScrollView contentContainerStyle={styles.content}>
          {lastSubmittedTicket ? (
            <View style={styles.submittedTicketCard}>
              <View style={styles.ticketSuccessIcon}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={30}
                  color="#23824A"
                />
              </View>
              <Text style={styles.submittedTitle}>
                Support request submitted
              </Text>
              <Text style={styles.ticketNumberLabel}>
                Ticket Number
              </Text>
              <Text style={styles.ticketNumber}>
                {lastSubmittedTicket.ticketNumber}
              </Text>
              <View style={styles.ticketDetailRow}>
                <Text style={styles.ticketDetailLabel}>Subject</Text>
                <Text style={styles.ticketDetailValue}>
                  {lastSubmittedTicket.subject}
                </Text>
              </View>
              <View style={styles.ticketDetailRow}>
                <Text style={styles.ticketDetailLabel}>Category</Text>
                <Text style={styles.ticketDetailValue}>
                  {lastSubmittedTicket.category}
                </Text>
              </View>
              <View style={styles.ticketDetailRow}>
                <Text style={styles.ticketDetailLabel}>Status</Text>
                <View style={styles.openStatusBadge}>
                  <Text style={styles.openStatusText}>
                    {lastSubmittedTicket.status || 'OPEN'}
                  </Text>
                </View>
              </View>
              <Text style={styles.ticketHistoryNote}>
                This is your latest submitted ticket. Complete ticket history and replies will be connected through the next API endpoint.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setPage('home')}>
                <Text style={styles.primaryButtonText}>
                  Back to Help & Support
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons
                  name="ticket-confirmation-outline"
                  size={48}
                  color="#FF6B00"
                />
              </View>
              <Text style={styles.emptyTitle}>
                No Support Requests Yet
              </Text>
              <Text style={styles.emptyDescription}>
                Your submitted support requests will appear here so you can track their status.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setPage('ticket')}>
                <Text style={styles.primaryButtonText}>
                  Raise a Support Ticket
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =====================================================
  // HELP & SUPPORT HOME
  // =====================================================
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader('Help & Support')}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            How can we help you?
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions or contact our support team.
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={25}
            color="#91857C"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor="#81746B"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={22}
                color="#81746B"
              />
            </TouchableOpacity>
          )}
        </View>

        {renderCategories()}
        {renderFaqs()}

        {/* SUPPORT ACTIONS */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <Text style={styles.sectionSubtitle}>
            Our support options are available here.
          </Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setPage('ticket')}
            activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons
                name="ticket-outline"
                size={28}
                color="#FF6B00"
              />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>
                Raise a Support Ticket
              </Text>
              <Text style={styles.actionDescription}>
                Tell us about your problem.
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color="#81746B"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setPage('requests')}
            activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={28}
                color="#FF6B00"
              />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>
                My Support Requests
              </Text>
              <Text style={styles.actionDescription}>
                View your latest submitted ticket.
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={25}
              color="#81746B"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;

// =====================================================
// STYLES
// =====================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#30251F',
  },
  headerSpace: {
    width: 40,
  },
  welcomeSection: {
    marginBottom: 22,
  },
  welcomeTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#30251F',
    lineHeight: 32,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#65584F',
    lineHeight: 23,
    marginTop: 7,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    height: 55,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEE2D8',
    marginBottom: 27,
  },
  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 15,
    color: '#30251F',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#241A14',
    lineHeight: 28,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#65584F',
    lineHeight: 21,
    marginTop: 6,
  },
  topicSection: {
    marginBottom: 28,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    marginTop: 15,
  },
  topicCard: {
    width: '48%',
    minHeight: 65,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0E1D5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 11,
  },
  topicCardFull: {
    width: '100%',
  },
  topicCardSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  topicIconContainer: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedTopicIcon: {
    backgroundColor: '#E85B00',
  },
  topicCardText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '800',
    color: '#554940',
  },
  topicCardTextSelected: {
    color: '#FFFFFF',
  },
  faqSection: {
    marginBottom: 29,
  },
  faqHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  faqHeadingText: {
    flex: 1,
    paddingRight: 8,
  },
  faqCountBadge: {
    minWidth: 38,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FFF0E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqCount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#E85B00',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9D9CC',
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  faqCardExpanded: {
    borderColor: '#FF9B57',
    borderWidth: 1.5,
  },
  faqQuestion: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  faqQuestionIcon: {
    width: 46,
    height: 46,
    backgroundColor: '#FFF0E3',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  faqQuestionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  faqCategoryLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E85B00',
    marginBottom: 6,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
    color: '#241A14',
    flexShrink: 1,
  },
  faqArrow: {
    marginLeft: 8,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  answerDivider: {
    height: 1,
    backgroundColor: '#EDE3DB',
    marginBottom: 15,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#51463F',
    fontWeight: '500',
  },
  noResults: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  noResultsText: {
    marginTop: 12,
    color: '#30251F',
    fontSize: 16,
    fontWeight: '800',
  },
  noResultsSubtitle: {
    marginTop: 6,
    color: '#65584F',
    fontSize: 14,
  },
  supportSection: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    borderWidth: 1,
    borderColor: '#EEE4DC',
    elevation: 2,
  },
  actionIcon: {
    width: 49,
    height: 49,
    backgroundColor: '#FFF1E6',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    color: '#30251F',
    fontWeight: '900',
  },
  actionDescription: {
    fontSize: 13,
    color: '#65584F',
    marginTop: 5,
    lineHeight: 19,
  },
  formIntro: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formIcon: {
    height: 70,
    width: 70,
    backgroundColor: '#FFF0E3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  formTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#30251F',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#65584F',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#30251F',
    marginBottom: 9,
    marginTop: 17,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E9DCD1',
    paddingHorizontal: 14,
    height: 53,
    fontSize: 15,
    color: '#30251F',
  },
  descriptionInput: {
    height: 140,
    paddingTop: 13,
  },
  ticketCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  categoryOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9DCD1',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 9,
  },
  categoryOptionSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#554940',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
  },
  optionalText: {
    color: '#65584F',
    fontSize: 12,
    marginTop: 12,
  },
  primaryButton: {
    minHeight: 53,
    borderRadius: 12,
    backgroundColor: '#FF6B00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 21,
    gap: 9,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  formNote: {
    textAlign: 'center',
    color: '#65584F',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 13,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: '#FFF0E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#30251F',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#65584F',
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 11,
  },
  submittedTicketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9DCD1',
    padding: 18,
    alignItems: 'center',
  },
  ticketSuccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAF5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submittedTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#30251F',
    textAlign: 'center',
  },
  ticketNumberLabel: {
    fontSize: 12,
    color: '#65584F',
    marginTop: 18,
  },
  ticketNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E85B00',
    marginTop: 5,
    marginBottom: 18,
  },
  ticketDetailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0E6DE',
    gap: 12,
  },
  ticketDetailLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#65584F',
  },
  ticketDetailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#30251F',
    textAlign: 'right',
  },
  openStatusBadge: {
    backgroundColor: '#FFF4D9',
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  openStatusText: {
    color: '#A36D08',
    fontSize: 11,
    fontWeight: '900',
  },
  ticketHistoryNote: {
    fontSize: 12,
    lineHeight: 19,
    color: '#65584F',
    marginTop: 15,
    textAlign: 'center',
  },
});
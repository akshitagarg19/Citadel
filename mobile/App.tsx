import React, { useState } from 'react';
import {
  //SafeAreaView,
  //StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const QUICK_REPLIES = [
  'I will pay by UPI.',
  'Could you repeat that, please?',
  'Please tell me the total.',
  'Thank you!',
];

export default function App() {
  const [selectedReply, setSelectedReply] = useState(
    'Hello! How can I help you?'
  );
  const [typedReply, setTypedReply] = useState('');
  const [isListening, setIsListening] = useState(false);

  const sendTypedReply = () => {
    const message = typedReply.trim();
    if (!message) return;

    setSelectedReply(message);
    setTypedReply('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top screen: clerk-facing display */}
      <View style={styles.clerkSection}>
        <View style={styles.rotatedContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.clerkLabel}>CITADEL</Text>
            <Text style={styles.smallLabel}>YOUR RESPONSE</Text>
          </View>

          <View style={styles.responseCard}>
            <Text style={styles.responseLabel}>SHOW THIS MESSAGE</Text>
            <Text style={styles.responseText}>{selectedReply}</Text>
          </View>

          <Text style={styles.clerkHint}>
            Please read the message above
          </Text>
        </View>
      </View>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>CITADEL • COMMUNICATION ASSISTANT</Text>
      </View>

      {/* Bottom screen: user-facing controls */}
      <View style={styles.userSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.heading}>Live conversation</Text>
          <View
            style={[
              styles.statusBadge,
              isListening && styles.listeningBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {isListening ? 'LISTENING' : 'READY'}
            </Text>
          </View>
        </View>

        <Text style={styles.captionLabel}>CLERK'S SPEECH</Text>

        <View style={styles.captionCard}>
          <Text style={styles.captionText}>
            Welcome! How would you like to make your payment today?
          </Text>
          <Text style={styles.mockLabel}>DEMO TRANSCRIPT</Text>
        </View>

        <Text style={styles.captionLabel}>QUICK REPLIES</Text>

        <ScrollView
          style={styles.replyScroll}
          contentContainerStyle={styles.replyGrid}
          showsVerticalScrollIndicator={false}
        >
          {QUICK_REPLIES.map((reply) => (
            <Pressable
              key={reply}
              onPress={() => setSelectedReply(reply)}
              style={({ pressed }) => [
                styles.replyButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.replyButtonText}>{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={typedReply}
            onChangeText={setTypedReply}
            placeholder="Type a custom reply..."
            placeholderTextColor="#8B96A9"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={sendTypedReply}
          />
          <Pressable style={styles.sendButton} onPress={sendTypedReply}>
            <Text style={styles.sendButtonText}>Show</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setIsListening((previous) => !previous)}
          style={[
            styles.listenButton,
            isListening && styles.stopButton,
          ]}
        >
          <Text style={styles.listenButtonText}>
            {isListening ? 'Stop listening' : 'Start listening'}
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Accessible communication • Designed for everyday interactions
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
  },
  clerkSection: {
    flex: 0.85,
    backgroundColor: '#182337',
    justifyContent: 'center',
    padding: 18,
  },
  rotatedContent: {
    flex: 1,
    transform: [{ rotate: '180deg' }],
    justifyContent: 'space-evenly',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clerkLabel: {
    color: '#7DD3FC',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  smallLabel: {
    color: '#A7B4C9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  responseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  responseLabel: {
    color: '#526176',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  responseText: {
    color: '#111827',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  clerkHint: {
    color: '#A7B4C9',
    textAlign: 'center',
    fontSize: 12,
  },
  divider: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    alignItems: 'center',
  },
  dividerText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  userSection: {
    flex: 1.4,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },
  heading: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  statusBadge: {
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  listeningBadge: {
    backgroundColor: '#166534',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  captionLabel: {
    color: '#A7B4C9',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 7,
  },
  captionCard: {
    backgroundColor: '#202D42',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 12,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
  },
  mockLabel: {
    color: '#7DD3FC',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 7,
  },
  replyScroll: {
    flexGrow: 0,
    maxHeight: 130,
  },
  replyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 4,
  },
  replyButton: {
    backgroundColor: '#25354D',
    borderWidth: 1,
    borderColor: '#45617F',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: '47%',
    flexGrow: 1,
  },
  pressedButton: {
    opacity: 0.7,
    backgroundColor: '#36506F',
  },
  replyButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#202D42',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#082F49',
    fontWeight: '800',
  },
  listenButton: {
    backgroundColor: '#0F766E',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  stopButton: {
    backgroundColor: '#B91C1C',
  },
  listenButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  footer: {
    color: '#8492A7',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 7,
  },
});

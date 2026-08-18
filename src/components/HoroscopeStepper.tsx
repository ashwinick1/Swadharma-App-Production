import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface HoroscopeStepperProps {
  currentStep: 1 | 2;
}

const HoroscopeStepper = ({
  currentStep,
}: HoroscopeStepperProps) => {
  return (
    <View style={styles.container}>

      <View style={styles.stepperContainer}>

        {/* Connector Line */}
        <View style={styles.connectorLine} />

        {/* Step 1 */}
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.circle,
              styles.activeCircle,
            ]}>
            <Text style={styles.circleText}>
              {currentStep === 2 ? '✓' : '1'}
            </Text>
          </View>

          <Text style={styles.activeLabel}>
            Birth Details
          </Text>
        </View>

        {/* Step 2 */}
        <View style={styles.stepContainer}>
          <View
            style={[
              styles.circle,
              currentStep === 2
                ? styles.activeCircle
                : styles.inactiveCircle,
            ]}>
            <Text
              style={
                currentStep === 2
                  ? styles.circleText
                  : styles.inactiveText
              }>
              2
            </Text>
          </View>

          <Text
            style={
              currentStep === 2
                ? styles.activeLabel
                : styles.inactiveLabel
            }>
            Your Horoscope
          </Text>
        </View>

      </View>

    </View>
  );
};

export default HoroscopeStepper;

const styles = StyleSheet.create({

  container: {
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  stepperContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  connectorLine: {
    position: 'absolute',
    top: 18,
    left: 45,
    right: 45,
    height: 2,
    backgroundColor: '#FF6B00',
    zIndex: 0,
  },

  stepContainer: {
    width: 90,
    alignItems: 'center',
    zIndex: 1,
  },

  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  activeCircle: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },

  inactiveCircle: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
  },

  circleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  inactiveText: {
    color: '#999999',
    fontSize: 17,
    fontWeight: '800',
  },

  activeLabel: {
    marginTop: 8,
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

  inactiveLabel: {
    marginTop: 8,
    color: '#999999',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

});
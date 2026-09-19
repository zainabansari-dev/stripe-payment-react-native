import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { StripeProvider, CardField, useStripe } from '@stripe/stripe-react-native';

const PUBLISHABLE_KEY = 'pk_test_51MbMp6Ab5bm7Lrzyq23UDaSbOuj2oQ4KhPy46veVfOfK2CdjKDNTmC1s3DaJPGfBiVnrQvomYVkUJQspITDeEmTo00lV2brajI';

function PaymentScreen() {
  const { confirmPayment } = useStripe();
  const [cardComplete, setCardComplete] = React.useState(false);

  const handlePay = async () => {
    try {
      const response = await fetch('http://192.168.1.105:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      const { clientSecret } = data;
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      if (error) Alert.alert('Failed', error.message);
      else Alert.alert('SUCCESS!', `Payment: ${paymentIntent.status}`);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real Stripe Payment</Text>
      <Text style={styles.amount}>Amount: 500 PKR</Text>

      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          placeholderColor: '#888888',
        }}
        style={styles.card}
        onCardChange={card => setCardComplete(card.complete)}
      />

      <View style={styles.button}>
        <Button title="PAY 500 PKR" onPress={handlePay} disabled={!cardComplete} color="#635BFF" />
      </View>

      <Text style={styles.hint}>Test: 4242 4242 4242 4242 - 12/34 - 123</Text>
    </View>
  );
}

export default function App() {
  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>
      <PaymentScreen />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#FFFFFF' },
  amount: { fontSize: 16, color: '#FFFFFF', marginBottom: 10 },
  card: { height: 50, marginVertical: 30 },
  button: { marginTop: 10 },
  hint: { marginTop: 20, color: '#AAAAAA', textAlign: 'center' },
});
import { Linking } from 'react-native';

export const OpenWhatsApp = async (phone, message) => {
    let phoneNumber = phone;
  
    if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.replace('0', '62');
    }
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`WhatsApp is not installed.`);
        }
      })
      .catch((error) => console.error(`Error opening WhatsApp: ${error}`));
  };
  
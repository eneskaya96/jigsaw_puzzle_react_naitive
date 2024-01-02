import {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {loginReq, registerReq, validTokenReq} from '../services/AuthService';
import {styles} from '../utilities/CustomStyles';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokenRead, setTokenRead] = useState(false);
  const [isPasswordOff, setIsPasswordOff] = useState(true);

  if (!tokenRead) {
    validTokenReq().then(success => {
      setTokenRead(true);
      if (success) {
        navigation.replace('Home');
      }
    });
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{...styles.container, margin: 20}}>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#333',
              borderRadius: 10,
              padding: 5,
              marginBottom: 20,
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="alternate-email"
              size={25}
              color="#fff"
              style={{marginRight: 5}}
            />
            <TextInput
              placeholder="email"
              placeholderTextColor="#aaa"
              onChangeText={_email => setEmail(_email)}
              style={styles.text_input}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#333',
              borderRadius: 10,
              padding: 5,
              alignItems: 'center',
            }}>
            <Ionicons
              name="ios-lock-closed-outline"
              size={25}
              color="#fff"
              style={{marginRight: 5}}
            />
            <TextInput
              placeholder="password"
              placeholderTextColor="#aaa"
              onChangeText={_password => setPassword(_password)}
              style={styles.text_input}
              secureTextEntry={isPasswordOff}
            />
            <TouchableOpacity
              onPress={() => {
                setIsPasswordOff(!isPasswordOff);
              }}>
              <Ionicons
                name={isPasswordOff ? 'eye-off' : 'eye'}
                size={25}
                color="#fff"
                style={{marginRight: 5}}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{paddingVertical: 10, alignSelf: 'flex-end'}}
            onPress={() => {}}>
            <Text style={{color: '#700', fontWeight: '700', fontSize: 12}}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              if (await loginReq(email, password)) {
                navigation.replace('Home');
              } else {
                Alert.alert('Error', 'Try Again', [
                  {text: 'OK', onPress: () => {}},
                ]);
              }
            }}
            style={{
              margin: 20,
              borderWidth: 1,
              backgroundColor: '#060',
              borderRadius: 20,
              borderColor: '#060',
              padding: 10,
              paddingHorizontal: 30,
            }}>
            <Text style={{fontSize: 25, color: '#fff'}}>Login</Text>
          </TouchableOpacity>

          <Text style={{fontSize: 10, color: '#500', marginTop: 30}}>
            Don't have an account yet?
          </Text>
          <TouchableOpacity
            onPress={async () => {
              if (await registerReq(email, password)) {
                Alert.alert('Success', 'Can Login Now', [
                  {text: 'OK', onPress: () => {}},
                ]);
              } else {
                Alert.alert('Error', 'Try Again', [
                  {text: 'OK', onPress: () => {}},
                ]);
              }
            }}
            style={{
              margin: 10,
              borderWidth: 1,
              backgroundColor: '#880',
              borderRadius: 20,
              borderColor: '#880',
              padding: 10,
              paddingHorizontal: 30,
            }}>
            <Text style={{fontSize: 15, color: '#fff'}}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

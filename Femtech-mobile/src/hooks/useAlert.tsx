import React, { createContext, useContext, useState, ReactNode } from 'react';
import ThemedAlert from '../components/ThemedAlert';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

interface AlertContextType {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
  success: (title: string, message?: string, onOk?: () => void) => void;
  error: (title: string, message?: string) => void;
  confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions>({
    title: '',
    message: '',
    buttons: [],
  });

  const hideAlert = () => setVisible(false);

  const alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    setAlertConfig({
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    });
    setVisible(true);
  };

  const success = (title: string, message?: string, onOk?: () => void) => {
    alert(title, message, [{ text: 'OK', onPress: onOk }]);
  };

  const error = (title: string, message?: string) => {
    alert(title, message, [{ text: 'OK' }]);
  };

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'Confirm', onPress: onConfirm },
    ]);
  };

  return (
    <AlertContext.Provider value={{ alert, success, error, confirm }}>
      {children}
      <ThemedAlert
        visible={visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}

import { router } from 'expo-router';

import { NewTaskModalScreen } from '../../src/screens/NewTaskModalScreen';

export default function NewTaskRoute() {
  return <NewTaskModalScreen onClose={() => router.back()} onSave={() => router.back()} />;
}

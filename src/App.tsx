import { Header } from '@/components/header';
import { Notification } from '@/features';

function App() {
  return (
    <div>
      <Header />
      <main className="mt-100 bg-bg-1 h-1/2 flex-center"> dsas</main>
      <footer className="bg-bg-3 h-1/4 flex-center">
        <Notification view={'default'} />
      </footer>
    </div>
  );
}

export default App;

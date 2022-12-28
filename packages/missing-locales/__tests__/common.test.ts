import path from 'path';
import missingLocales from '../src';

test('getMissedKeys', () => {
  const missing = missingLocales({
    path: path.resolve('__tests__', './locales'),
    defaultNamespace: 'testnamespace'
  });

  expect(missing).toEqual([
    { locale: 'es', namespace: 'testnamespace', key: 'abracadabra' },
    { locale: 'es', namespace: 'testnamespace', key: 'testKey2' },
    { locale: 'es', namespace: 'testnamespace', key: 'testKey3' }
  ]);
});

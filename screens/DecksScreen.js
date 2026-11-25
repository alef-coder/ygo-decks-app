import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  FAB,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { excluirDeck, listarDecks } from '../services/decksApi';

export default function DecksScreen({ navigation }) {
  const { colors } = useTheme();
  const [decks, setDecks] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async (puxar = false) => {
    if (puxar) setAtualizando(true);
    setErro(null);
    try {
      setDecks(await listarDecks());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  // Recarrega a lista toda vez que a tela volta a ficar visível
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(deck) {
    Alert.alert('Excluir deck', `Deseja excluir "${deck.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirDeck(deck._id);
            setDecks((atual) => atual.filter((d) => d._id !== deck._id));
          } catch (e) {
            Alert.alert('Erro ao excluir', e.message);
          }
        },
      },
    ]);
  }

  function renderConteudo() {
    if (carregando) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" />
          <Text style={styles.espaco}>Carregando decks...</Text>
        </View>
      );
    }

    if (erro) {
      return (
        <View style={styles.centro}>
          <Text style={{ color: colors.error, textAlign: 'center' }}>{erro}</Text>
          <Button mode="contained" onPress={() => carregar()} style={styles.espaco}>
            Tentar novamente
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={decks}
        keyExtractor={(item) => item._id}
        refreshing={atualizando}
        onRefresh={() => carregar(true)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.centro}>
            <Text variant="titleMedium">Nenhum deck ainda</Text>
            <Text style={styles.vazio}>Toque em "Novo deck" para criar o primeiro.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.nome}
              subtitle={`${item.cartas?.length ?? 0} cartas`}
              right={() => (
                <View style={styles.acoes}>
                  <IconButton
                    icon="pencil"
                    onPress={() => navigation.navigate('DeckForm', { deck: item })}
                  />
                  <IconButton icon="delete" onPress={() => confirmarExclusao(item)} />
                </View>
              )}
            />
            <Card.Content style={styles.conteudo}>
              <Chip compact icon="sword-cross" style={styles.chip}>
                {item.estrategia}
              </Chip>
              {!!item.descricao && <Text variant="bodyMedium">{item.descricao}</Text>}
            </Card.Content>
          </Card>
        )}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderConteudo()}
      <FAB
        icon="plus"
        label="Novo deck"
        style={styles.fab}
        onPress={() => navigation.navigate('DeckForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lista: { padding: 16, paddingBottom: 96, flexGrow: 1 },
  card: { marginBottom: 12 },
  acoes: { flexDirection: 'row' },
  conteudo: { gap: 8, paddingBottom: 12 },
  chip: { alignSelf: 'flex-start' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  espaco: { marginTop: 12 },
  vazio: { marginTop: 4, opacity: 0.7, textAlign: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});
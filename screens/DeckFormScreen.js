import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { criarDeck, editarDeck } from '../services/decksApi';

const ESTRATEGIAS = ['Agressivo', 'Controle', 'Combo', 'Equilibrado'];

export default function DeckFormScreen({ navigation, route }) {
  const deckEditado = route.params?.deck;
  const editando = !!deckEditado;
  const { colors } = useTheme();

  const [nome, setNome] = useState(deckEditado?.nome ?? '');
  const [descricao, setDescricao] = useState(deckEditado?.descricao ?? '');
  const [estrategia, setEstrategia] = useState(deckEditado?.estrategia ?? 'Equilibrado');
  const [salvando, setSalvando] = useState(false);
  const [tentou, setTentou] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: editando ? 'Editar deck' : 'Novo deck' });
  }, [navigation, editando]);

  const nomeInvalido = tentou && nome.trim().length === 0;

  async function salvar() {
    setTentou(true);
    if (nome.trim().length === 0) return;

    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), descricao: descricao.trim(), estrategia };
      if (editando) {
        await editarDeck(deckEditado._id, dados);
      } else {
        await criarDeck(dados);
      }
      navigation.goBack();
    } catch (e) {
      setSalvando(false);
      Alert.alert('Não foi possível salvar', e.message);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <TextInput
          label="Nome do deck"
          mode="outlined"
          value={nome}
          onChangeText={setNome}
          maxLength={60}
          error={nomeInvalido}
        />
        <HelperText type="error" visible={nomeInvalido}>
          O nome do deck é obrigatório
        </HelperText>
      </View>

      <TextInput
        label="Descrição"
        mode="outlined"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
        maxLength={300}
      />

      <Text variant="titleSmall">Estratégia</Text>
      <View style={styles.chips}>
        {ESTRATEGIAS.map((opcao) => (
          <Chip
            key={opcao}
            selected={estrategia === opcao}
            onPress={() => setEstrategia(opcao)}
          >
            {opcao}
          </Chip>
        ))}
      </View>

      <Button mode="contained" onPress={salvar} loading={salvando} disabled={salvando}>
        {editando ? 'Salvar alterações' : 'Criar deck'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
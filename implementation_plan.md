# Drag and Drop para Linhas da Table

A tabela passará a suportar ordenação manual de linhas via Drag and Drop, semelhante ao comportamento que implementamos em `SortableTabs` e na `Sidebar`.

## Open Questions
- A ordenação via Drag and Drop será limitada à página atual (já que a tabela suporta paginação). Isso é aceitável? Na maioria dos sistemas sim, pois reordenar itens entre páginas não visíveis via drag é inviável em UI.

## Proposed Changes

### [Table.qml]
#### [MODIFY] Table.qml
- Adicionar a propriedade `property bool dragToReorder: false`.
- Adicionar o sinal `signal rowsReordered(int fromIndex, int toIndex)`.
- Substituir o `Flickable` + `Column` + `Repeater` por uma `ListView` + `DelegateModel` para facilitar o uso do `visualModel.items.move(from, to)`.
- Adicionar um ícone de "grip-vertical" no início de cada linha (visível apenas quando `dragToReorder` for true).
- Implementar o `DragHandler` e a `DropArea` no delegate da linha, usando a mesma lógica que estabilizamos nas Tabs (com `_visualIndex` e recálculo da ordem no drop).

### [test/PlaygroundTable.qml]
#### [MODIFY] test/PlaygroundTable.qml
- Atualizar o playground para demonstrar uma Tabela com `dragToReorder: true`.

## Verification Plan
- Rodar o preview (`sh run_preview.sh`).
- Navegar para a seção "Dados > Table".
- Testar arrastar as linhas pelo ícone de "grip".
- Verificar se a seleção visual e o array de dados são atualizados corretamente sem quebrar os bindings de `currentIndex`.

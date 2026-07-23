import type { Employee } from '../mockDatabase';
import type { KanbanColumn, KanbanItem } from '@mocha-ds/react-pro';

export const demoEmployees: Employee[] = [
  { id: '1', name: 'Alice Silva', email: 'alice@example.com', role: 'Designer', department: 'Design', status: 'Active', salary: 8000, joinedDate: '2023-01-15' },
  { id: '2', name: 'Bruno Costa', email: 'bruno@example.com', role: 'Developer', department: 'Engineering', status: 'Active', salary: 12000, joinedDate: '2022-06-01' },
  { id: '3', name: 'Carla Souza', email: 'carla@example.com', role: 'PM', department: 'Product', status: 'Inactive', salary: 15000, joinedDate: '2021-03-10' },
  { id: '4', name: 'Daniel Oliveira', email: 'daniel@example.com', role: 'Developer', department: 'Engineering', status: 'Pending', salary: 9000, joinedDate: '2024-09-20' },
  { id: '5', name: 'Eduarda Lima', email: 'eduarda@example.com', role: 'Designer', department: 'Design', status: 'Active', salary: 9500, joinedDate: '2023-11-05' },
];

export const initialKanbanColumns: KanbanColumn[] = [
  { id: 'backlog', title: 'A fazer (Backlog)', color: 'maroon' },
  { id: 'todo', title: 'Pronto para Iniciar (To Do)', color: 'peach' },
  { id: 'in-progress', title: 'Em Progresso (In Progress)', color: 'blue' },
  { id: 'done', title: 'Concluído (Done)', color: 'green' }
];

export const initialKanbanItems: KanbanItem[] = [
  { id: 'task-1', columnId: 'done', title: 'Configurar Estrutura Monorepo', description: 'Estruturação do workspace Yarn com pacotes individuais para react, css e showcase.', tags: ['Dev', 'Setup'] },
  { id: 'task-2', columnId: 'done', title: 'Definir Paleta de Cores', description: 'Integração completa com os tons oficiais do Catppuccin (Macchiato/Mocha/Latte).', tags: ['Design'] },
  { id: 'task-3', columnId: 'in-progress', title: 'Implementar Componentes Core', description: 'Desenvolvimento e testes dos botões, inputs, modais e accordion.', tags: ['React', 'Core'] },
  { id: 'task-4', columnId: 'todo', title: 'Redigir Documentação Técnica', description: 'Escrever guias detalhados sobre como consumir os pacotes do design system.', tags: ['Docs'] },
  { id: 'task-5', columnId: 'in-progress', title: 'Criar Componente de Kanban Pro', description: 'Novo componente Kanban com suporte nativo a arrastar e soltar (reordenável).', tags: ['Pro', 'Dev'] },
  { id: 'task-6', columnId: 'backlog', title: 'Testar Acessibilidade Teclado', description: 'Garantir que a reordenação das colunas e cartões atenda aos requisitos WCAG.', tags: ['Acessibilidade'] }
];

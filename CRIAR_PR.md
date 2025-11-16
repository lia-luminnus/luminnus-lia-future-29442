# 🚀 Como Criar o Pull Request

Você tem **3 opções** para criar o PR:

---

## Opção 1: Script Automático (Recomendado) 🎯

Execute o script que criei:

```bash
cd /home/user/luminnus-lia-future-29442
bash create-pr.sh
```

O script irá:
- ✅ Verificar se GitHub CLI está instalado
- ✅ Criar o PR automaticamente com descrição completa
- ✅ Ou fornecer link para criação manual se `gh` não estiver disponível

---

## Opção 2: Link Direto (Mais Rápido) ⚡

Clique neste link e o GitHub vai preparar o PR para você:

👉 **[CRIAR PR AGORA](https://github.com/lia-luminnus/luminnus-lia-future-29442/compare/main...claude/fix-lia-admin-panel-01JB6teKdPHaJufRbYSDDQBh)**

Depois:
1. Cole o conteúdo do arquivo `PR_DESCRIPTION.md` na descrição
2. Clique em "Create pull request"

---

## Opção 3: GitHub CLI Manual 🛠️

Se você tem o GitHub CLI instalado:

```bash
cd /home/user/luminnus-lia-future-29442

gh pr create \
  --title "Fix: Corrigir todos os problemas do LIA Admin Panel" \
  --body-file PR_DESCRIPTION.md \
  --base main \
  --head claude/fix-lia-admin-panel-01JB6teKdPHaJufRbYSDDQBh
```

---

## 📄 Descrição do PR

A descrição completa do PR está em: `PR_DESCRIPTION.md`

Você pode visualizar com:
```bash
cat PR_DESCRIPTION.md
```

Ou editar se necessário:
```bash
nano PR_DESCRIPTION.md
```

---

## ✅ Verificação Antes de Criar

Antes de criar o PR, verifique:

```bash
# Ver os commits que serão incluídos
git log --oneline HEAD~2..HEAD

# Ver os arquivos modificados
git diff --name-only HEAD~2..HEAD

# Ver o status atual
git status
```

Saída esperada:
```
f117c20 Fix: Sincronização de planos Admin → Site e cálculo anual correto
4c080b7 Fix: Corrigir salvamento de System Prompt e melhorar segurança
```

---

## 🎯 Próximos Passos Após Criar o PR

1. ✅ PR criado
2. 👀 Revisar as mudanças no GitHub
3. ✔️ Aprovar e fazer merge
4. 🚀 Deploy para produção
5. ⚙️ Aplicar migração do Supabase
6. 🔒 Configurar variáveis de ambiente seguras

---

**Dúvidas?** Consulte a documentação do GitHub CLI: https://cli.github.com/manual/

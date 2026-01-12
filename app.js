// AgroMilk - Sistema de Gestão de Ordenhas
class AgroMilk {
    constructor() {
        this.vacas = [];
        this.ordenhas = [];
        this.grupo1 = []; // Grupo 1 de vacas
        this.grupo2 = []; // Grupo 2 de vacas
        this.vacaEditando = null;
        this.ordenhaAtiva = null; // Sessão de ordenha ativa
        this.gruposOrdenhaAtual = []; // Grupos registados na sessão atual
        this.carregarDados();
        this.inicializar();
    }

    inicializar() {
        // Event listeners para navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.mudarPagina(e.target.dataset.page);
            });
        });

        this.atualizarInterface();
        this.atualizarMediaGeral();
    }

    // ========== GESTÃO DE DADOS ==========
    carregarDados() {
        const vacasSalvas = localStorage.getItem('agromilk_vacas');
        const ordenhasSalvas = localStorage.getItem('agromilk_ordenhas');
        
        if (vacasSalvas) {
            this.vacas = JSON.parse(vacasSalvas);
        }
        
        if (ordenhasSalvas) {
            this.ordenhas = JSON.parse(ordenhasSalvas);
        }
    }

    salvarDados() {
        localStorage.setItem('agromilk_vacas', JSON.stringify(this.vacas));
        localStorage.setItem('agromilk_ordenhas', JSON.stringify(this.ordenhas));
    }

    // ========== GESTÃO DE VACAS ==========
    adicionarVaca() {
        this.vacaEditando = null;
        document.getElementById('modal-form-titulo').textContent = 'Adicionar Nova Vaca';
        document.getElementById('vaca-numero').value = '';
        document.getElementById('vaca-estado').value = 'ordenha';
        document.getElementById('modal-form-vaca').classList.add('show');
    }

    editarVaca(numero) {
        const vaca = this.vacas.find(v => v.numero === numero);
        if (!vaca) return;

        this.vacaEditando = numero;
        document.getElementById('modal-form-titulo').textContent = 'Editar Vaca';
        document.getElementById('vaca-numero').value = vaca.numero;
        document.getElementById('vaca-numero').disabled = true;
        document.getElementById('vaca-estado').value = vaca.estado;
        document.getElementById('modal-form-vaca').classList.add('show');
    }

    salvarVaca(event) {
        event.preventDefault();
        
        const numero = parseInt(document.getElementById('vaca-numero').value);
        const estado = document.getElementById('vaca-estado').value;

        if (this.vacaEditando === null) {
            // Adicionar nova vaca
            if (this.vacas.find(v => v.numero === numero)) {
                this.mostrarAlerta('Já existe uma vaca com este número!', 'erro');
                return;
            }

            this.vacas.push({
                numero: numero,
                estado: estado,
                ordenhas: []
            });

            this.mostrarAlerta(`Vaca #${numero} adicionada com sucesso!`, 'sucesso');
        } else {
            // Editar vaca existente
            const vaca = this.vacas.find(v => v.numero === this.vacaEditando);
            if (vaca) {
                vaca.estado = estado;
                this.mostrarAlerta(`Vaca #${numero} atualizada com sucesso!`, 'sucesso');
            }
        }

        this.salvarDados();
        this.fecharModalForm();
        this.atualizarInterface();
    }

    eliminarVaca(numero) {
        if (confirm(`Tem certeza que deseja eliminar a vaca #${numero}?\nEsta ação não pode ser desfeita.`)) {
            this.vacas = this.vacas.filter(v => v.numero !== numero);
            this.ordenhas = this.ordenhas.filter(o => !o.vacas.find(v => v.numero === numero));
            this.salvarDados();
            this.atualizarInterface();
            this.mostrarAlerta(`Vaca #${numero} eliminada com sucesso!`, 'sucesso');
        }
    }

    // ========== CÁLCULOS ==========
    calcularMediaGeral() {
        // Obter as últimas 10 ordenhas
        const ultimasOrdenhas = [...this.ordenhas]
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .slice(0, 10);

        if (ultimasOrdenhas.length === 0) return null;

        // Calcular média por vaca de cada ordenha
        const mediasOrdenhas = ultimasOrdenhas.map(ordenha => {
            const totalLeite = ordenha.vacas.reduce((sum, v) => sum + v.quantidade, 0);
            return totalLeite / ordenha.vacas.length;
        });

        // Calcular média das médias
        const somaMedias = mediasOrdenhas.reduce((sum, media) => sum + media, 0);
        const mediaGeral = somaMedias / mediasOrdenhas.length;

        return {
            media: mediaGeral.toFixed(2),
            numeroOrdenhas: ultimasOrdenhas.length
        };
    }

    atualizarMediaGeral() {
        const container = document.getElementById('media-geral-container');
        if (!container) return;

        const resultado = this.calcularMediaGeral();

        if (!resultado) {
            container.innerHTML = '<p style="color: #999; font-size: 0.9em;">Sem dados de ordenha</p>';
            return;
        }

        container.innerHTML = `
            <div class="media-geral-badge">
                <span class="media-geral-label">📊 Média Geral (Últimas ${resultado.numeroOrdenhas} ordenhas):</span>
                <span class="media-geral-valor">${resultado.media}L/vaca</span>
            </div>
        `;
    }

    calcularMediaVaca(numero) {
        const ordenhasVaca = this.ordenhas
            .filter(o => o.vacas.find(v => v.numero === numero))
            .sort((a, b) => new Date(b.data) - new Date(a.data)) // Mais recentes primeiro
            .slice(0, 10); // Apenas os últimos 10

        if (ordenhasVaca.length === 0) return 0;

        const totalLeite = ordenhasVaca.reduce((total, ordenha) => {
            const vacaOrdenha = ordenha.vacas.find(v => v.numero === numero);
            return total + (vacaOrdenha ? vacaOrdenha.quantidade : 0);
        }, 0);

        return (totalLeite / ordenhasVaca.length).toFixed(2);
    }

    calcularMediaVacaAntes(numero, ordenhaIdExcluir) {
        const ordenhasVaca = this.ordenhas
            .filter(o => o.id !== ordenhaIdExcluir && o.vacas.find(v => v.numero === numero))
            .sort((a, b) => new Date(b.data) - new Date(a.data)) // Mais recentes primeiro
            .slice(0, 10); // Apenas os últimos 10

        if (ordenhasVaca.length === 0) return 0;

        const totalLeite = ordenhasVaca.reduce((total, ordenha) => {
            const vacaOrdenha = ordenha.vacas.find(v => v.numero === numero);
            return total + (vacaOrdenha ? vacaOrdenha.quantidade : 0);
        }, 0);

        return parseFloat((totalLeite / ordenhasVaca.length).toFixed(2));
    }

    obterHistoricoVaca(numero, limite = null) {
        const historico = this.ordenhas
            .filter(o => o.vacas.find(v => v.numero === numero))
            .map(ordenha => {
                const vacaOrdenha = ordenha.vacas.find(v => v.numero === numero);
                return {
                    data: ordenha.data,
                    quantidade: vacaOrdenha.quantidade,
                    notas: ordenha.notas
                };
            })
            .sort((a, b) => new Date(b.data) - new Date(a.data));
        
        return limite ? historico.slice(0, limite) : historico;
    }

    // ========== INTERFACE - PERFIS ==========
    atualizarInterface() {
        this.atualizarEstatisticas();
        this.renderizarListaVacas();
        this.renderizarSelecaoVacas();
        this.atualizarMediaGeral();
    }

    atualizarEstatisticas() {
        const totalVacas = this.vacas.length;
        const vacasOrdenha = this.vacas.filter(v => v.estado === 'ordenha').length;
        const vacasSecas = this.vacas.filter(v => v.estado === 'seca').length;

        document.getElementById('total-vacas').textContent = totalVacas;
        document.getElementById('vacas-ordenha').textContent = vacasOrdenha;
        document.getElementById('vacas-secas').textContent = vacasSecas;
    }

    renderizarListaVacas(vacasFiltradas = null) {
        const container = document.getElementById('lista-vacas');
        const vacas = vacasFiltradas || this.vacas;

        if (vacas.length === 0) {
            container.innerHTML = '<div class="vazio">Nenhuma vaca registada. Clique em "Adicionar Vaca" para começar.</div>';
            return;
        }

        // Ordenar por número
        const vacasOrdenadas = [...vacas].sort((a, b) => a.numero - b.numero);

        container.innerHTML = vacasOrdenadas.map(vaca => {
            const media = this.calcularMediaVaca(vaca.numero);
            const totalOrdenhas = this.obterHistoricoVaca(vaca.numero).length;

            return `
                <div class="vaca-card" onclick="app.verPerfil(${vaca.numero})">
                    <div class="numero">Vaca #${vaca.numero}</div>
                    <span class="estado ${vaca.estado}">${this.traduzirEstado(vaca.estado)}</span>
                    <div class="media">
                        🥛 Média: ${media > 0 ? media + ' L' : 'Sem dados'}
                    </div>
                    <div class="media">
                        📊 Ordenhas: ${totalOrdenhas}
                    </div>
                    <div class="acoes">
                        <button class="btn-small btn-edit" onclick="event.stopPropagation(); app.editarVaca(${vaca.numero})">
                            ✏️ Editar
                        </button>
                        <button class="btn-small btn-delete" onclick="event.stopPropagation(); app.eliminarVaca(${vaca.numero})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    pesquisarVaca(termo) {
        if (!termo) {
            this.renderizarListaVacas();
            return;
        }

        const vacasFiltradas = this.vacas.filter(vaca => 
            vaca.numero.toString().includes(termo)
        );

        this.renderizarListaVacas(vacasFiltradas);
    }

    verPerfil(numero) {
        const vaca = this.vacas.find(v => v.numero === numero);
        if (!vaca) return;

        const media = this.calcularMediaVaca(numero);
        const historicoCompleto = this.obterHistoricoVaca(numero);
        const historico = this.obterHistoricoVaca(numero, 10); // Últimas 10 ordenhas
        const totalOrdenhas = historicoCompleto.length;

        const historicoHTML = historico.length > 0 ? `
            ${historico.map((h, index) => `
                <div class="ordenha-item ${index === 0 ? 'mais-recente' : ''}">
                    <div class="data">
                        📅 ${this.formatarData(h.data)}
                        ${index === 0 ? '<span class="badge-recente">Mais recente</span>' : ''}
                    </div>
                    <div class="quantidade">🥛 ${h.quantidade} litros</div>
                    ${h.notas ? `<div class="notas">💭 ${h.notas}</div>` : ''}
                </div>
            `).join('')}
            ${totalOrdenhas > 10 ? `<p style="text-align: center; color: #999; margin-top: 15px; font-style: italic;">A mostrar os últimos 10 de ${totalOrdenhas} registos de ordenha</p>` : ''}
        ` : '<div class="vazio">Ainda não há ordenhas registadas para esta vaca.</div>';

        document.getElementById('perfil-conteudo').innerHTML = `
            <div class="perfil-header">
                <div class="numero">Vaca #${vaca.numero}</div>
                <span class="estado ${vaca.estado}">${this.traduzirEstado(vaca.estado)}</span>
            </div>

            <div class="perfil-stats">
                <div class="perfil-stat">
                    <h4>Média de Leite</h4>
                    <p>${media > 0 ? media + ' L' : 'Sem dados'}</p>
                    <small style="color: #666; font-size: 0.8em;">
                        ${totalOrdenhas > 0 ? `(baseada nos últimos ${Math.min(totalOrdenhas, 10)} registos)` : ''}
                    </small>
                </div>
                <div class="perfil-stat">
                    <h4>Total de Ordenhas</h4>
                    <p>${totalOrdenhas}</p>
                </div>
                <div class="perfil-stat">
                    <h4>Estado</h4>
                    <p>${this.traduzirEstado(vaca.estado)}</p>
                </div>
            </div>

            <div class="historico-ordenhas">
                <h3>📋 Últimos Registos de Ordenha</h3>
                ${historicoHTML}
            </div>
        `;

        document.getElementById('modal-perfil').classList.add('show');
    }

    // ========== INTERFACE - ORDENHA ==========
    renderizarSelecaoVacas() {
        const container = document.getElementById('lista-selecao-vacas');
        
        // Iniciar sessão de ordenha se não existir
        if (!this.ordenhaAtiva) {
            this.ordenhaAtiva = {
                id: Date.now(),
                dataInicio: new Date().toISOString(),
                vacasOrdenhadas: []
            };
        }

        const vacasDisponiveis = this.vacas.filter(v => v.estado === 'ordenha' || v.estado === 'seca');

        if (vacasDisponiveis.length === 0) {
            container.innerHTML = '<div class="vazio">Nenhuma vaca disponível. Adicione vacas em "Perfis das Vacas".</div>';
            return;
        }

        // Ordenar por número
        const vacasOrdenadas = [...vacasDisponiveis].sort((a, b) => a.numero - b.numero);

        container.innerHTML = vacasOrdenadas.map(vaca => {
            const noGrupo1 = this.grupo1.includes(vaca.numero);
            const noGrupo2 = this.grupo2.includes(vaca.numero);
            const jaOrdenhada = this.ordenhaAtiva.vacasOrdenhadas.includes(vaca.numero);
            
            let classes = 'vaca-selecao';
            let badge = '';
            
            if (jaOrdenhada) {
                classes += ' ja-ordenhada';
                badge = '<div class="badge-ordenhada">✓ Ordenhada</div>';
            } else if (noGrupo1) {
                classes += ' grupo-1';
                badge = '<div class="badge-grupo grupo-1-badge">Grupo 1</div>';
            } else if (noGrupo2) {
                classes += ' grupo-2';
                badge = '<div class="badge-grupo grupo-2-badge">Grupo 2</div>';
            }
            
            return `
                <div class="${classes}" 
                     onclick="app.toggleSelecaoVaca(${vaca.numero})"
                     ${jaOrdenhada ? 'title="Vaca já ordenhada nesta sessão"' : ''}>
                    <div class="numero">Vaca #${vaca.numero}</div>
                    <span class="estado ${vaca.estado}">${this.traduzirEstado(vaca.estado)}</span>
                    ${badge}
                </div>
            `;
        }).join('');

        this.atualizarContadorSelecao();
        this.atualizarInfoOrdenha();
    }

    toggleSelecaoVaca(numero) {
        const vaca = this.vacas.find(v => v.numero === numero);
        
        // Verificar se já foi ordenhada nesta sessão
        if (this.ordenhaAtiva && this.ordenhaAtiva.vacasOrdenhadas.includes(numero)) {
            this.mostrarAlerta(
                `A vaca #${numero} já foi ordenhada nesta sessão!`,
                'aviso'
            );
            return;
        }
        
        // Verificar se a vaca está seca
        if (vaca.estado === 'seca' && !this.grupo1.includes(numero) && !this.grupo2.includes(numero)) {
            this.mostrarAlerta(
                `⚠️ ATENÇÃO: A vaca #${numero} está SECA e não deveria estar na ordenha!`,
                'aviso'
            );
            return;
        }

        // Verificar em qual grupo está
        const indexGrupo1 = this.grupo1.indexOf(numero);
        const indexGrupo2 = this.grupo2.indexOf(numero);
        
        if (indexGrupo1 !== -1) {
            // Remover do grupo 1
            this.grupo1.splice(indexGrupo1, 1);
        } else if (indexGrupo2 !== -1) {
            // Remover do grupo 2
            this.grupo2.splice(indexGrupo2, 1);
        } else {
            // Adicionar a um grupo
            if (this.grupo1.length < 8) {
                this.grupo1.push(numero);
            } else if (this.grupo2.length < 8) {
                this.grupo2.push(numero);
            } else {
                this.mostrarAlerta('Ambos os grupos já têm 8 vacas! Remova uma para adicionar outra.', 'erro');
                return;
            }
        }

        this.renderizarSelecaoVacas();
        this.atualizarFormOrdenha();
    }

    atualizarContadorSelecao() {
        const contador = document.getElementById('contador-selecao');
        if (contador) {
            contador.textContent = this.grupo1.length + this.grupo2.length;
        }
    }

    atualizarInfoOrdenha() {
        const infoContainer = document.querySelector('.ordenha-info');
        if (!infoContainer) return;

        if (!this.ordenhaAtiva) {
            infoContainer.innerHTML = `
                <p><strong>Sessão de Ordenha</strong></p>
                <p>Selecione até 8 vacas por grupo. Pode trabalhar com 2 grupos simultaneamente (máximo 16 vacas).</p>
            `;
            return;
        }

        const totalVacasOrdenhadas = this.ordenhaAtiva.vacasOrdenhadas.length;
        const totalGrupos = this.gruposOrdenhaAtual.length;
        const vacasEmOrdenha = this.vacas.filter(v => v.estado === 'ordenha').length;
        const vacasRestantes = vacasEmOrdenha - totalVacasOrdenhadas;

        infoContainer.innerHTML = `
            <p><strong>Sessão de Ordenha Ativa</strong></p>
            <p><strong>Vacas ordenhadas:</strong> ${totalVacasOrdenhadas} / ${vacasEmOrdenha}</p>
            <p><strong>Grupos registados:</strong> ${totalGrupos}</p>
            <p><strong>Vacas restantes:</strong> ${vacasRestantes}</p>
            <div style="display: flex; gap: 20px; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
                <p><strong>🔵 Grupo 1:</strong> ${this.grupo1.length} / 8 vacas</p>
                <p><strong>🟣 Grupo 2:</strong> ${this.grupo2.length} / 8 vacas</p>
            </div>
        `;
    }

    atualizarFormOrdenha() {
        const form = document.getElementById('ordenha-form');
        const container = document.getElementById('inputs-ordenha');

        if (this.grupo1.length === 0 && this.grupo2.length === 0) {
            form.style.display = 'none';
            return;
        }

        form.style.display = 'block';

        let html = '';
        let botoes = '';

        // Grupo 1
        if (this.grupo1.length > 0) {
            html += '<div class="grupo-ordenha-section grupo-1-section">';
            html += '<h4>🔵 Grupo 1 (' + this.grupo1.length + ' vacas)</h4>';
            html += this.grupo1.map(numero => `
                <div class="ordenha-input-group">
                    <label>Vaca #${numero}</label>
                    <input type="number" 
                           id="quantidade-g1-${numero}" 
                           placeholder="Litros" 
                           min="0" 
                           step="0.1" 
                           required>
                </div>
            `).join('');
            html += '<button class="btn-primary btn-large" style="margin-top: 15px;" onclick="app.registarGrupoEspecifico(1)">✓ Registar Grupo 1</button>';
            html += '</div>';
        }

        // Grupo 2
        if (this.grupo2.length > 0) {
            html += '<div class="grupo-ordenha-section grupo-2-section">';
            html += '<h4>🟣 Grupo 2 (' + this.grupo2.length + ' vacas)</h4>';
            html += this.grupo2.map(numero => `
                <div class="ordenha-input-group">
                    <label>Vaca #${numero}</label>
                    <input type="number" 
                           id="quantidade-g2-${numero}" 
                           placeholder="Litros" 
                           min="0" 
                           step="0.1" 
                           required>
                </div>
            `).join('');
            html += '<button class="btn-primary btn-large" style="margin-top: 15px;" onclick="app.registarGrupoEspecifico(2)">✓ Registar Grupo 2</button>';
            html += '</div>';
        }

        // Botão para registar ambos (se ambos os grupos tiverem vacas)
        if (this.grupo1.length > 0 && this.grupo2.length > 0) {
            html += '<div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0;">';
            html += '<button class="btn-primary btn-large" style="background: #28a745;" onclick="app.registarAmbosGrupos()">✓✓ Registar Ambos os Grupos</button>';
            html += '</div>';
        }

        container.innerHTML = html;
    }

    limparOrdenha() {
        if (this.ordenhaAtiva && (this.grupo1.length > 0 || this.grupo2.length > 0 || this.ordenhaAtiva.vacasOrdenhadas.length > 0)) {
            if (confirm('Tem certeza que deseja cancelar toda a sessão de ordenha? Todos os grupos registados serão perdidos!')) {
                this.grupo1 = [];
                this.grupo2 = [];
                this.ordenhaAtiva = null;
                this.gruposOrdenhaAtual = [];
                document.getElementById('notas-ordenha').value = '';
                
                // Remover botão de finalizar
                const btnFinalizar = document.getElementById('btn-finalizar-ordenha');
                if (btnFinalizar) {
                    btnFinalizar.remove();
                }
                
                this.renderizarSelecaoVacas();
                this.atualizarFormOrdenha();
                this.atualizarResumoGrupos();
                this.mostrarAlerta('Sessão de ordenha cancelada.', 'aviso');
            }
        }
    }

    registarGrupoEspecifico(numeroGrupo) {
        const grupoVacas = numeroGrupo === 1 ? this.grupo1 : this.grupo2;
        
        if (grupoVacas.length === 0) {
            this.mostrarAlerta('Nenhuma vaca selecionada neste grupo!', 'erro');
            return;
        }

        const vacasGrupo = [];
        let erros = false;

        // Recolher dados do grupo específico
        for (const numero of grupoVacas) {
            const input = document.getElementById(`quantidade-g${numeroGrupo}-${numero}`);
            const quantidade = parseFloat(input.value);

            if (!quantidade || quantidade <= 0) {
                this.mostrarAlerta(`Insira uma quantidade válida para a vaca #${numero} do Grupo ${numeroGrupo}!`, 'erro');
                erros = true;
                break;
            }

            vacasGrupo.push({
                numero: numero,
                quantidade: quantidade,
                grupo: numeroGrupo
            });
        }

        if (erros) return;

        // Adicionar grupo à sessão atual
        this.gruposOrdenhaAtual.push({
            vacas: vacasGrupo,
            timestamp: new Date().toISOString(),
            numeroGrupo: numeroGrupo
        });

        // Marcar vacas como ordenhadas nesta sessão
        this.ordenhaAtiva.vacasOrdenhadas.push(...grupoVacas);

        const totalLitros = vacasGrupo.reduce((sum, v) => sum + v.quantidade, 0).toFixed(1);
        const cor = numeroGrupo === 1 ? '🔵' : '🟣';
        this.mostrarAlerta(
            `✅ ${cor} Grupo ${numeroGrupo} registado! ${grupoVacas.length} vaca(s), Total: ${totalLitros}L`,
            'sucesso'
        );

        // Limpar apenas o grupo registado
        if (numeroGrupo === 1) {
            this.grupo1 = [];
        } else {
            this.grupo2 = [];
        }

        this.renderizarSelecaoVacas();
        this.atualizarFormOrdenha();

        // Mostrar botão de finalizar se houver grupos registados
        this.mostrarBotaoFinalizar();
        
        // Atualizar resumo de grupos registados
        this.atualizarResumoGrupos();
    }

    registarAmbosGrupos() {
        if (this.grupo1.length === 0 && this.grupo2.length === 0) {
            this.mostrarAlerta('Selecione pelo menos uma vaca!', 'erro');
            return;
        }

        const vacasGrupo = [];
        let erros = false;

        // Recolher dados do Grupo 1
        for (const numero of this.grupo1) {
            const input = document.getElementById(`quantidade-g1-${numero}`);
            const quantidade = parseFloat(input.value);

            if (!quantidade || quantidade <= 0) {
                this.mostrarAlerta(`Insira uma quantidade válida para a vaca #${numero} do Grupo 1!`, 'erro');
                erros = true;
                break;
            }

            vacasGrupo.push({
                numero: numero,
                quantidade: quantidade,
                grupo: 1
            });
        }

        // Recolher dados do Grupo 2
        if (!erros) {
            for (const numero of this.grupo2) {
                const input = document.getElementById(`quantidade-g2-${numero}`);
                const quantidade = parseFloat(input.value);

                if (!quantidade || quantidade <= 0) {
                    this.mostrarAlerta(`Insira uma quantidade válida para a vaca #${numero} do Grupo 2!`, 'erro');
                    erros = true;
                    break;
                }

                vacasGrupo.push({
                    numero: numero,
                    quantidade: quantidade,
                    grupo: 2
                });
            }
        }

        if (erros) return;

        // Adicionar grupos à sessão atual
        this.gruposOrdenhaAtual.push({
            vacas: vacasGrupo,
            timestamp: new Date().toISOString(),
            grupo1Count: this.grupo1.length,
            grupo2Count: this.grupo2.length
        });

        // Marcar vacas como ordenhadas nesta sessão
        this.ordenhaAtiva.vacasOrdenhadas.push(...this.grupo1, ...this.grupo2);

        const totalLitros = vacasGrupo.reduce((sum, v) => sum + v.quantidade, 0).toFixed(1);
        this.mostrarAlerta(
            `✅ Ambos os grupos registados! Grupo 1: ${this.grupo1.length} vacas, Grupo 2: ${this.grupo2.length} vacas. Total: ${totalLitros}L`,
            'sucesso'
        );

        // Limpar ambos os grupos
        this.grupo1 = [];
        this.grupo2 = [];
        this.renderizarSelecaoVacas();
        this.atualizarFormOrdenha();

        // Mostrar botão de finalizar se houver grupos registados
        this.mostrarBotaoFinalizar();
        
        // Atualizar resumo de grupos registados
        this.atualizarResumoGrupos();
    }

    registarGrupo() {
        // Função mantida para compatibilidade - redireciona para registar ambos
        this.registarAmbosGrupos();
    }

    mostrarBotaoFinalizar() {
        const form = document.getElementById('ordenha-form');
        let btnFinalizar = document.getElementById('btn-finalizar-ordenha');
        
        if (!btnFinalizar && this.gruposOrdenhaAtual.length > 0) {
            btnFinalizar = document.createElement('button');
            btnFinalizar.id = 'btn-finalizar-ordenha';
            btnFinalizar.className = 'btn-primary btn-large';
            btnFinalizar.style.marginTop = '20px';
            btnFinalizar.style.background = '#28a745';
            btnFinalizar.textContent = `🏁 Finalizar Ordenha (${this.gruposOrdenhaAtual.length} grupo(s) registado(s))`;
            btnFinalizar.onclick = () => app.finalizarOrdenha();
            
            form.parentElement.appendChild(btnFinalizar);
        } else if (btnFinalizar) {
            btnFinalizar.textContent = `🏁 Finalizar Ordenha (${this.gruposOrdenhaAtual.length} grupo(s) registado(s))`;
        }
    }

    atualizarResumoGrupos() {
        const resumoContainer = document.getElementById('resumo-grupos-registados');
        const listaContainer = document.getElementById('lista-grupos-registados');
        
        if (this.gruposOrdenhaAtual.length === 0) {
            resumoContainer.style.display = 'none';
            return;
        }

        resumoContainer.style.display = 'block';

        const html = this.gruposOrdenhaAtual.map((grupo, index) => {
            const totalGrupo = grupo.vacas.reduce((sum, v) => sum + v.quantidade, 0).toFixed(1);
            const vacasTexto = grupo.vacas.map(v => `Vaca #${v.numero} - ${v.quantidade}L`).join(' ; ');
            
            let titulo = `${index + 1}º Grupo`;
            if (grupo.numeroGrupo) {
                titulo += grupo.numeroGrupo === 1 ? ' 🔵' : ' 🟣';
            } else if (grupo.grupo1Count && grupo.grupo2Count) {
                titulo += ' 🔵🟣';
            }

            return `
                <div class="grupo-registado-item">
                    <div class="grupo-registado-header">
                        <strong>${titulo}</strong>
                        <span class="grupo-total">Total: ${totalGrupo}L</span>
                    </div>
                    <div class="grupo-registado-vacas">
                        ${vacasTexto}
                    </div>
                </div>
            `;
        }).join('');

        listaContainer.innerHTML = html;
    }

    finalizarOrdenha() {
        if (this.gruposOrdenhaAtual.length === 0) {
            this.mostrarAlerta('Nenhum grupo foi registado ainda!', 'erro');
            return;
        }

        // Verificar se há vacas em ordenha que não foram ordenhadas
        const vacasEmOrdenha = this.vacas.filter(v => v.estado === 'ordenha');
        const vacasNaoOrdenhadas = vacasEmOrdenha.filter(v => 
            !this.ordenhaAtiva.vacasOrdenhadas.includes(v.numero)
        );

        if (vacasNaoOrdenhadas.length > 0) {
            const numerosNaoOrdenhadas = vacasNaoOrdenhadas.map(v => `#${v.numero}`).join(', ');
            const plural = vacasNaoOrdenhadas.length > 1;
            const mensagem = `⚠️ ATENÇÃO: ${plural ? 'As vacas' : 'A vaca'} ${numerosNaoOrdenhadas} ${plural ? 'estão' : 'está'} em ordenha mas não ${plural ? 'foram ordenhadas' : 'foi ordenhada'}.\n\n${plural ? 'Estas vacas não vieram' : 'Esta vaca não veio'} à ordenha?\n\nTem a certeza que quer finalizar?`;
            
            if (!confirm(mensagem)) {
                return;
            }
        }

        const notas = document.getElementById('notas-ordenha').value.trim();

        // Consolidar todos os grupos numa única ordenha
        const todasVacas = [];
        this.gruposOrdenhaAtual.forEach(grupo => {
            todasVacas.push(...grupo.vacas);
        });

        // Criar registo da ordenha completa
        const ordenha = {
            id: this.ordenhaAtiva.id,
            data: new Date().toISOString(),
            vacas: todasVacas,
            notas: notas,
            totalGrupos: this.gruposOrdenhaAtual.length
        };

        this.ordenhas.push(ordenha);
        this.salvarDados();

        // Verificar vacas com produção abaixo da média
        const vacasAbaixoMedia = [];
        for (const vacaOrdenha of todasVacas) {
            const mediaAnterior = this.calcularMediaVacaAntes(vacaOrdenha.numero, ordenha.id);
            if (mediaAnterior > 0) {
                const diferenca = mediaAnterior - vacaOrdenha.quantidade;
                if (diferenca >= 4) {
                    vacasAbaixoMedia.push({
                        numero: vacaOrdenha.numero,
                        quantidade: vacaOrdenha.quantidade,
                        media: mediaAnterior,
                        diferenca: diferenca.toFixed(1)
                    });
                }
            }
        }

        // Mostrar aviso se houver vacas abaixo da média
        if (vacasAbaixoMedia.length > 0) {
            const mensagemVacas = vacasAbaixoMedia.map(v => 
                `  • Vaca #${v.numero}: ${v.quantidade}L (média: ${v.media}L, diferença: -${v.diferenca}L)`
            ).join('\n');
            
            const plural = vacasAbaixoMedia.length > 1;
            alert(`⚠️ ATENÇÃO - Produção Abaixo da Média\n\n${plural ? 'As seguintes vacas produziram' : 'A seguinte vaca produziu'} 4 litros ou mais abaixo da sua média:\n\n${mensagemVacas}\n\nRecomenda-se verificar ${plural ? 'estas vacas' : 'esta vaca'}.`);
        }

        const totalLitros = todasVacas.reduce((sum, v) => sum + v.quantidade, 0).toFixed(1);
        this.mostrarAlerta(
            `✅ ORDENHA FINALIZADA! ${todasVacas.length} vaca(s) ordenhadas em ${this.gruposOrdenhaAtual.length} grupo(s). Total: ${totalLitros}L`,
            'sucesso'
        );

        // Guardar informação da última ordenha para exibição
        this.guardarUltimaOrdenha(ordenha, this.gruposOrdenhaAtual);

        // Resetar sessão
        this.vacasSelecionadas = [];
        this.ordenhaAtiva = null;
        this.gruposOrdenhaAtual = [];
        document.getElementById('notas-ordenha').value = '';
        
        // Remover botão de finalizar
        const btnFinalizar = document.getElementById('btn-finalizar-ordenha');
        if (btnFinalizar) {
            btnFinalizar.remove();
        }

        this.renderizarSelecaoVacas();
        this.atualizarFormOrdenha();
        this.atualizarInterface();
        this.atualizarResumoGrupos();
        this.atualizarMediaGeral();
    }

    guardarOrdenha() {
        // Esta função agora não é usada, substituída por registarGrupo e finalizarOrdenha
        this.registarGrupo();
    }

    guardarUltimaOrdenha(ordenha, gruposDetalhados) {
        const ultimaOrdenha = {
            ordenha: ordenha,
            grupos: gruposDetalhados
        };
        localStorage.setItem('agromilk_ultima_ordenha', JSON.stringify(ultimaOrdenha));
    }

    carregarUltimaOrdenha() {
        const ultimaSalva = localStorage.getItem('agromilk_ultima_ordenha');
        if (!ultimaSalva) return null;
        return JSON.parse(ultimaSalva);
    }

    renderizarUltimaOrdenha() {
        const container = document.getElementById('conteudo-ultima-ordenha');
        const ultimaOrdenha = this.carregarUltimaOrdenha();

        if (!ultimaOrdenha) {
            container.innerHTML = '<div class="vazio">Ainda não há nenhuma ordenha registada.</div>';
            return;
        }

        const ordenha = ultimaOrdenha.ordenha;
        const grupos = ultimaOrdenha.grupos;
        const totalGeral = ordenha.vacas.reduce((sum, v) => sum + v.quantidade, 0).toFixed(1);

        const gruposHTML = grupos.map((grupo, index) => {
            const totalGrupo = grupo.vacas.reduce((sum, v) => sum + v.quantidade, 0).toFixed(1);
            const vacasTexto = grupo.vacas.map(v => `Vaca #${v.numero} - ${v.quantidade}L`).join(' ; ');
            
            let titulo = `${index + 1}º Grupo`;
            if (grupo.numeroGrupo) {
                titulo += grupo.numeroGrupo === 1 ? ' 🔵' : ' 🟣';
            } else if (grupo.grupo1Count && grupo.grupo2Count) {
                titulo += ' 🔵🟣';
            }

            return `
                <div class="grupo-registado-item">
                    <div class="grupo-registado-header">
                        <strong>${titulo}</strong>
                        <span class="grupo-total">Total: ${totalGrupo}L</span>
                    </div>
                    <div class="grupo-registado-vacas">
                        ${vacasTexto}
                    </div>
                </div>
            `;
        }).join('');

        const mediaPorVaca = (parseFloat(totalGeral) / ordenha.vacas.length).toFixed(2);

        container.innerHTML = `
            <div class="ultima-ordenha-info">
                <div class="info-row">
                    <div class="info-item">
                        <strong>📅 Data:</strong> ${this.formatarData(ordenha.data)}
                    </div>
                    <div class="info-item">
                        <strong>🐄 Vacas:</strong> ${ordenha.vacas.length}
                    </div>
                    <div class="info-item">
                        <strong>📦 Grupos:</strong> ${grupos.length}
                    </div>
                    <div class="info-item">
                        <strong>🥛 Total:</strong> ${totalGeral}L
                    </div>
                    <div class="info-item info-destaque">
                        <strong>📊 Média/Vaca:</strong> ${mediaPorVaca}L
                    </div>
                </div>
                ${ordenha.notas ? `
                    <div class="ordenha-notas-display">
                        <strong>💭 Notas:</strong>
                        <p>${ordenha.notas}</p>
                    </div>
                ` : ''}
            </div>

            <div class="resumo-grupos">
                <h3>📊 Grupos Registados</h3>
                <div>
                    ${gruposHTML}
                </div>
            </div>
        `;
    }

    // ========== NAVEGAÇÃO ==========
    mudarPagina(pagina) {
        // Atualizar botões de navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === pagina) {
                btn.classList.add('active');
            }
        });

        // Atualizar páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        document.getElementById(`${pagina}-page`).classList.add('active');

        // Atualizar interface ao mudar de página
        if (pagina === 'ultima') {
            this.renderizarUltimaOrdenha();
        } else {
            this.atualizarInterface();
        }
    }

    // ========== MODAIS ==========
    fecharModal() {
        document.getElementById('modal-perfil').classList.remove('show');
    }

    fecharModalForm() {
        document.getElementById('modal-form-vaca').classList.remove('show');
        document.getElementById('vaca-numero').disabled = false;
    }

    // ========== UTILITÁRIOS ==========
    traduzirEstado(estado) {
        const estados = {
            'ordenha': 'Em Ordenha',
            'seca': 'Seca',
            'vendida': 'Vendida'
        };
        return estados[estado] || estado;
    }

    formatarData(dataISO) {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
    }

    mostrarAlerta(mensagem, tipo = 'sucesso') {
        const alerta = document.createElement('div');
        alerta.className = `alerta ${tipo}`;
        alerta.textContent = mensagem;
        
        const main = document.querySelector('main');
        main.insertBefore(alerta, main.firstChild);

        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}

// Inicializar aplicação
const app = new AgroMilk();

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modalPerfil = document.getElementById('modal-perfil');
    const modalForm = document.getElementById('modal-form-vaca');
    
    if (event.target === modalPerfil) {
        app.fecharModal();
    }
    if (event.target === modalForm) {
        app.fecharModalForm();
    }
}

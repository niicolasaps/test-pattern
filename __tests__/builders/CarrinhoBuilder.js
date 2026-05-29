import { Carrinho } from '../../src/domain/Carrinho.js';
import { UserMother } from './UserMother.js';

export class CarrinhoBuilder {
    constructor() {

        this.user = UserMother.umUsuarioPadrao();
        this.itens = [{ id: 1, nome: 'Item Padrão', preco: 100 }];
    }

    comUser(user) {
        this.user = user;
        return this; 
    }

    comItens(itens) {
        this.itens = itens;
        return this;
    }

    vazio() {
        this.itens = [];
        return this;
    }

    build() {
        return new Carrinho(this.user, this.itens);
    }
}
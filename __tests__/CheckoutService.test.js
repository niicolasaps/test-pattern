import { jest } from '@jest/globals';
import { CheckoutService } from '../src/services/CheckoutService.js';
import { UserMother } from './builders/UserMother.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';

describe('CheckoutService', () => {

    
    describe('quando o pagamento falha', () => {
        it('deve retornar null e não processar o pedido', async () => {
            
            const carrinho = new CarrinhoBuilder().build();

            
            const gatewayStub = { 
                cobrar: jest.fn().mockResolvedValue({ success: false }) 
            };
            const repositoryDummy = {};
            const emailDummy = {};

            const checkoutService = new CheckoutService(gatewayStub, repositoryDummy, emailDummy);

            
            const pedido = await checkoutService.processarPedido(carrinho);

            
            expect(pedido).toBeNull();
        });
    });

   
    describe('quando um cliente Premium finaliza a compra', () => {
        it('deve aplicar desconto de 10% e enviar email de confirmacao', async () => {
            
            const usuarioPremium = UserMother.umUsuarioPremium();
            const carrinho = new CarrinhoBuilder()
                .comUser(usuarioPremium)
                .comItens([{ preco: 200 }])
                .build();

            
            const gatewayStub = { 
                cobrar: jest.fn().mockResolvedValue({ success: true }) 
            };
            const repositoryStub = { 
                salvar: jest.fn().mockResolvedValue({ id: 999, status: 'APROVADO' }) 
            };
            
            
            const emailMock = { 
                enviarEmail: jest.fn().mockResolvedValue(true) 
            };

            const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);

            
            await checkoutService.processarPedido(carrinho);

            
            expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, undefined);
            
            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
            
          
            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                'premium@email.com', 
                'Seu Pedido foi Aprovado!',
                'Pedido 999 no valor de R$180'
            );
        });
    });

});
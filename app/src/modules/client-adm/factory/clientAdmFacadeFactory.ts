// dependências
import ClientAdmFacade from "../facade/clientAdmFacade";
import ClientRepository from "../repository/clientRepository";
import AddClientUseCase from "../usecase/add-client/addClientUseCase";
import FindClientUseCase from "../usecase/find-client/findClientUseCase";

// classe de fábrica da facade
// como trata-se de um objeto complexo, além de não ser interessante expor para o mundo externo a forma de criação da facade,
// foi criada a factory
export default class ClientAdmFacadeFactory {
  static create() {
    const repository = new ClientRepository();
    const findUsecase = new FindClientUseCase(repository);
    const addUsecase = new AddClientUseCase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: findUsecase,
    });

    return facade;
  }
}

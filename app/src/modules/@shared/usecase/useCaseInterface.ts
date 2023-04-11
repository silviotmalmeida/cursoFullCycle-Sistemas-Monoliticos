// interface para definição dos casos de uso
export default interface UseCaseInterface {
  execute(input: any): Promise<any>;
}

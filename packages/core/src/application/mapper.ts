export interface IToDomainMapper<Domain, Persistence> {
  toDomain(persistence: Persistence): Domain;
}

export interface IToDtoMapper<Domain, DTO> {
  toDTO(domain: Domain): DTO;
}

export interface IToPersistenceMapper<Domain, Persistence> {
  toPersistence(domain: Domain): Persistence;
}

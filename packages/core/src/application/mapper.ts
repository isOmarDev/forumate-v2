export interface ToDomainMapper<Domain, Persistence> {
  toDomain(persistence: Persistence): Domain;
}

export interface ToDtoMapper<Domain, DTO> {
  toDTO(domain: Domain): DTO;
}

export interface ToPersistenceMapper<Domain, Persistence> {
  toPersistence(domain: Domain): Persistence;
}

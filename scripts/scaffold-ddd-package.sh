
# cleanup
rm ./src/app.controller.spec.ts
rm ./src/app.controller.ts
rm ./src/app.service.ts

# core
mkdir -p ./src/core/application/ports
mkdir -p ./src/core/application/services
mkdir -p ./src/core/domain/aggregates
mkdir -p ./src/core/domain/entities
mkdir -p ./src/core/domain/services
mkdir -p ./src/core/domain/value-objects

# infrastructure
mkdir -p ./src/infrastructure/adapters
mkdir -p ./src/infrastructure/mappers
mkdir -p ./src/infrastructure/repositories

# interface
mkdir -p ./src/interface/commands
mkdir -p ./src/interface/controllers
mkdir -p ./src/interface/dtos
mkdir -p ./src/interface/presenters
mkdir -p ./src/interface/queries
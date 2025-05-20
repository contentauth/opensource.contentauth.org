import React from 'react';
import styles from './ConformingProductsSchema.module.css';

const PropertyTable = ({ properties, title, required = [] }) => {
  if (!properties) return null;

  const getObjectTableId = (propName) => {
    // Map property names to their corresponding table titles
    const tableMap = {
      product: 'Product properties',
      roles: 'Roles properties',
      containers: 'Containers properties',
      sbom: 'SBOM properties',
      DN: 'DN (Distinguished Name) properties',
      assurance: 'Assurance properties',
      generate: 'Containers properties',
      validate: 'Containers properties',
    };

    const tableTitle = tableMap[propName];
    return tableTitle ? tableTitle.toLowerCase().replace(/\s+/g, '-') : null;
  };

  return (
    <div className={styles.propertyTableContainer}>
      <h2 id={title.toLowerCase().replace(/\s+/g, '-')}>{title}</h2>
      <table className={styles.propertyTable}>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(properties).map(([propName, propDetails]) => {
            const isRequired = required.includes(propName);
            let type = propDetails.type;
            const objectTableId = getObjectTableId(propName);

            // Handle array types
            if (type === 'array' && propDetails.items) {
              if (
                propDetails.items.type === 'string' &&
                propDetails.items.enum
              ) {
                type = (
                  <span>
                    Array containing any of:
                    {propDetails.items.enum.map((value, index) => (
                      <React.Fragment key={index}>
                        <br />
                        {value}
                      </React.Fragment>
                    ))}
                  </span>
                );
              } else {
                type = `array of ${propDetails.items.type}`;
              }
            }

            // Handle enum types
            if (propDetails.enum) {
              type = propDetails.enum.join(' or ');
            }

            // Add link for object types
            if (type === 'object' && objectTableId) {
              type = <a href={`#${objectTableId}`}>Object</a>;
            } else if (typeof type === 'string') {
              // Capitalize primitive types
              type = type.charAt(0).toUpperCase() + type.slice(1);
            }

            return (
              <tr key={propName}>
                <td>
                  <code>{propName}</code>
                </td>
                <td>{type}</td>
                <td>{propDetails.description}</td>
                <td>{isRequired ? 'Yes' : 'No'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ConformingProductsSchema = () => {
  const schema = {
    // Main array item properties
    mainProperties: {
      containers: {
        type: 'object',
        description:
          'The file types supported by the product for both C2PA claim generation and/or validation',
      },
      dateCreated: {
        type: 'string',
        description:
          '[Constant] The date that the product record was created on the CPL',
        format: 'date',
      },
      dateModified: {
        type: 'string',
        description:
          'The date that this product record on the CPL was last modified',
        format: 'date',
      },
      product: {
        type: 'object',
        description:
          'Product details as described in the product properties table',
      },
      recordNumber: {
        type: 'string',
        description:
          'An RFC 9562 Version 7 UUID identifying this record on the CPL',
        pattern:
          '^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
      },
      roles: {
        type: 'object',
        description:
          'Whether the product is a C2PA Claim Generator or a C2PA Claim Validator, or both',
      },
      specVersion: {
        type: 'array',
        description:
          'The version(s) of the C2PA Content Credentials specification that is supported by this product',
        items: { type: 'string', enum: ['2.1'] },
      },
      sbom: {
        type: 'object',
        description: 'Software bill of materials for the product',
      },
      status: {
        type: 'string',
        description:
          "Status of the product's standing in the C2PA Conformance Program",
        enum: [
          'approved',
          'revoked_eol',
          'revoked_expired',
          'revoked_vulnerability',
        ],
      },
      vendor: {
        type: 'string',
        description: 'Legal name of the vendor organization',
      },
    },
    // Product properties
    productProperties: {
      productType: {
        type: 'string',
        description:
          'Whether the product is software, hardware, or library object of a product',
        enum: ['application', 'device', 'library'],
      },
      DN: {
        type: 'object',
        description: 'The name that uniquely identifies the product',
      },
      minVersion: {
        type: 'string',
        description:
          'The minimum software version of this product that is eligible for certificates under this record',
      },
      integrates: {
        type: 'array',
        description:
          'If the product includes one or more existing libraries on the CPL, the record numbers of the integrated libraries are listed in this array',
      },
      assurance: {
        type: 'object',
        description:
          "Attributes which further define levels of relied confidence into the security of this product's implementation",
      },
    },
    // DN properties
    dnProperties: {
      CN: {
        type: 'string',
        description:
          'The user-facing marketing name and/or model of the device, application, or service',
      },
      O: {
        type: 'string',
        description: 'Legal name of the vendor organization',
      },
      OU: {
        type: 'string',
        description:
          "Department or subdivision within the vendor's organization that created this product",
      },
      C: {
        type: 'string',
        description:
          'Country where the vendor organization is registered to do business',
      },
    },
    // Assurance properties
    assuranceProperties: {
      maxAssuranceLevel: {
        type: 'integer',
        description:
          'The level of implementation security assurance, as defined by the C2PA Conformance Program',
        minimum: 0,
        maximum: 2,
      },
      attestationMethods: {
        type: 'array',
        description: 'Methods of integrity assurance that the product supports',
        items: {
          type: 'string',
          enum: [
            'Android_KeyAttestation',
            'Google_PlayIntegrity',
            'Apple_DCAppAttest',
            'Qualcomm_QWES',
            'Intel_SGX',
            'TPM2.0',
            'IETF_RATS',
          ],
        },
      },
    },
    // Roles properties
    rolesProperties: {
      generator: {
        type: 'boolean',
        description: 'Whether the product can generate C2PA claims',
      },
      validator: {
        type: 'boolean',
        description: 'Whether the product can validate C2PA claims',
      },
    },
    // Containers properties
    containersProperties: {
      generate: {
        type: 'object',
        description:
          'The file types for which the product can support C2PA claim generation',
      },
      validate: {
        type: 'object',
        description:
          'The file types for which the product can support C2PA claim validation',
      },
    },
    // SBOM properties
    sbomProperties: {
      url: {
        type: 'string',
        description: 'A publicly addressable location of the SBOM',
        format: 'uri',
      },
    },
  };

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        Schema for the C2PA Conforming Products List. The schema defines an
        array of product records, where each record contains the following
        properties:
      </p>

      <PropertyTable
        properties={schema.mainProperties}
        title=""
        required={[
          'recordNumber',
          'vendor',
          'product',
          'specVersion',
          'roles',
          'containers',
          'status',
          'dateCreated',
          'dateModified',
        ]}
      />

      <PropertyTable
        properties={schema.productProperties}
        title="Product properties"
        required={['productType', 'DN']}
      />

      <PropertyTable
        properties={schema.dnProperties}
        title="DN (Distinguished Name) properties"
        required={['CN', 'O', 'C']}
      />

      <PropertyTable
        properties={schema.assuranceProperties}
        title="Assurance properties"
        required={['maxAssuranceLevel', 'attestationMethods']}
      />

      <PropertyTable
        properties={schema.rolesProperties}
        title="Roles properties"
        required={['generator', 'validator']}
      />

      <PropertyTable
        properties={schema.containersProperties}
        title="Containers properties"
        required={['generate', 'validate']}
      />

      <PropertyTable
        properties={schema.sbomProperties}
        title="SBOM properties"
        required={['url']}
      />

      <div className={styles.note}>
        <p>
          <strong>Note:</strong> The containers.generate and containers.validate
          objects each contain arrays of supported MIME types for different
          content categories (image, video, audio, documents, fonts, and
          mlModel). For a complete list of supported MIME types, please refer to
          the schema definition.
        </p>
      </div>
    </div>
  );
};

export default ConformingProductsSchema;

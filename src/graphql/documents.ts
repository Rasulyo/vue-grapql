import { gql } from "@apollo/client/core";

const REPO_FRAGMENT = gql`
  fragment repo on Repository {
    id
    name
    url
    stargazers {
      totalCount
    }
    viewerHasStarred
    description
    licenseInfo {
      name
    }
    updatedAt
    owner {
      login
      avatarUrl
    }
    primaryLanguage {
      color
      name
    }
    repositoryTopics(first: 10) {
      edges {
        node {
          topic {
            name
          }
        }
      }
    }
  }
`;


export const SEARCH_REPOS = gql`
  ${REPO_FRAGMENT}

  query SearchRepoQuery($query: String!, $limit: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $limit, after: $after) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          ...repo
        }
      }
    }
  }
`;

export const GET_OWN_REPOSITORIES = gql`
  query GetOwnRepositories($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(affiliations: [OWNER], first: 100, after: $cursor) {
        edges {
          node {
            id
            name
            url
            stargazers {
              totalCount
            }
            viewerHasStarred
            description
            licenseInfo {
              name
            }
            updatedAt
            owner {
              login
              avatarUrl
            }
            primaryLanguage {
              color
              name
            }
            repositoryTopics(first: 10) {
              edges {
                node {
                  topic {
                    name
                  }
                }
              }
            }
            languages(first: 10) {  # Include languages used in the repository
              edges {
                node {
                  name
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
      }
    }
  }
`;


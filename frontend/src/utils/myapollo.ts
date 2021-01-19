import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { PaginatedPost } from "../generated/graphql";
import { createWithApolloClient } from "./createWithApolloClient";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: "http://localhost:4002/graphql",
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPost | undefined,
                incoming: PaginatedPost
              ): PaginatedPost {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });

export const hocApollo = createWithApolloClient(createClient);

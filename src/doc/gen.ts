//import SyntaxKind = ts.SyntaxKind;
//import TypeChecker = ts.TypeChecker;
//import SourceFile = ts.SourceFile;
//
//import { Doc } from './doc';
//
//interface VisitContext {
//    typeChecker: TypeChecker;
//    tsInst: typeof ts;
//    doc: Doc
//}
//
//export function processSourceFile(source: SourceFile, ctx: VisitContext) {
//    ctx.doc.sourceFile = {
//        fileName: source.fileName,
//        text: source.fileName,
//        moduleName: source.moduleName,
//        languageVersion: source.languageVersion
//    };
//
//    function visitNode(node: Node) {
//        switch (node.kind) {
//            case SyntaxKind.InterfaceDeclaration:
//                visitInterface(node, ctx)
//        }
//        ctx.tsInst.forEachChild(node, visitNode);
//    }
//    visitNode(source);
//}
//
//export function visitInterface(node: Node, ctx: VisitContext) {
//    ctx.doc.addType(ctx.typeChecker.getTypeAtLocation(node))
//}
//
